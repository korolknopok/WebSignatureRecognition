import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import axios from "axios";

interface Signature {
    id: number;
    name: string;
    url: string;
    blobUrl?: string;
}

interface GetSignaturesInfoResponse {
    id: number;
    name: string;
}

const SignatureUploader: React.FC = () => {

    const DETECT_PATH = "http://localhost:5000";

    const API_PATH = "http://localhost:7015";

    const [signatures, setSignatures] = useState<{ original: Signature[], test: Signature[] }>({
        original: [],
        test: [],
    });

    const [selectedSignatures, setSelectedSignatures] = useState<{ original: string | null, test: string | null }>({
        original: null,
        test: null,
    });

    const [previews, setPreviews] = useState<{ original: string | null, test: string | null }>({
        original: null,
        test: null,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const originalInputRef = useRef<HTMLInputElement | null>(null);
    const testInputRef = useRef<HTMLInputElement | null>(null);

    const getToken = (): string | null => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Токен отсутствует. Авторизуйтесь снова.");
            return null;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            setError("Токен истёк. Авторизуйтесь снова.");
            return null;
        }
        return token;
    };

    const fetchSignatures = async () => {
        setLoading(true);
        setError(null);

        const token = getToken();
        if (!token) return;

        console.log("Используем токен:", token);

        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        };

        console.log("Заголовки запроса:", headers);

        try {
            const response = await axios.get<GetSignaturesInfoResponse[]>(`${API_PATH}/api/Signatures/Information/Get`, {
                headers,
            });

            console.log("Ответ от сервера:", response);

            if (response.status === 200) {
                const fetchedSignatures: Signature[] = response.data.map((sig: GetSignaturesInfoResponse) => ({
                    id: sig.id,
                    name: sig.name,
                    url: `${API_PATH}/api/Signatures/GetSignature?fileId=${sig.id}`,
                }));

                for (const sig of fetchedSignatures) {
                    const imageResponse = await axios.get(sig.url, {
                        responseType: 'blob',
                        headers: headers,
                    });
                    sig.blobUrl = URL.createObjectURL(imageResponse.data); // Создаём Blob-URL
                }

                setSignatures((prev) => ({
                    ...prev,
                    original: fetchedSignatures,
                }));
            } else {
                setError("Ошибка при загрузке подписей.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    setError("Токен истек или недействителен. Пожалуйста, авторизуйтесь снова.");
                } else {
                    setError("Не удалось загрузить подписи.");
                }
            } else {
                setError("Произошла неизвестная ошибка.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSignatures();
    }, []);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        type: "original" | "test"
    ) => {
        const files = event.target.files;
        if (files) {
            const newSignatures: Signature[] = Array.from(files).map((file, index) => ({
                id: signatures[type].length + index + 1,
                name: file.name,
                blobUrl: URL.createObjectURL(file),
            }));

            if (type === "original") {
                const token = getToken();
                if (!token) return;

                try {
                    const formData = new FormData();
                    Array.from(files).forEach((file) => formData.append("file", file));

                    await axios.post(`${API_PATH}/api/Signatures/AddSignature`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    fetchSignatures();
                } catch (error) {
                    console.error("Ошибка при загрузке подписей", error);
                    setError("Не удалось загрузить подписи.");
                }
            } else {
                setSignatures((prev) => ({
                    ...prev,
                    [type]: [...prev[type], ...newSignatures],
                }));
            }
        }
    };

    const handleDeleteSignature = async (fileId: number) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error("Токена нет");
            }

            await axios.delete(`${API_PATH}/api/Signatures/DeleteSignature`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: '*/*',
                },
                params: { fileId },
            });

            console.log(`Файл с ID ${fileId} успешно удален.`);

            setSignatures((prev) => ({
                ...prev,
                original: prev.original.filter((signature) => signature.id !== fileId),
            }));
        } catch (error) {
            console.error("Ошибка при удалении подписи", error);
            setError("Не удалось удалить подпись.");
        }
    };

    const handleSelectSignature = (type: "original" | "test", url: string) => {
        setSelectedSignatures((prev) => ({ ...prev, [type]: url }));
        setPreviews((prev) => ({ ...prev, [type]: url }));
    };

    const handleVerifySignatures = () => {
        if (selectedSignatures.original && selectedSignatures.test) {
            alert("Проверка подлинности подписи...");
        } else {
            alert("Пожалуйста, выберите оригинальную подпись и проверяемую подпись.");
        }
    };

    const renderSignatureOptions = (type: "original" | "test") => (
        <select onChange={(e) => handleSelectSignature(type, e.target.value)}>
            <option value="">-- Выберите подпись --</option>
            {signatures[type].map((signature) => (
                <option key={signature.id} value={signature.blobUrl}>
                    {signature.name}
                </option>
            ))}
        </select>
    );

    const renderPreview = (type: "original" | "test") =>
        previews[type] && (
            <div className="preview-container">
                <h4>{type === "original" ? "Оригинальная подпись:" : "Проверяемая подпись:"}</h4>
                <img
                    src={previews[type]!}
                    alt={`${type} Signature`}
                    className="image-preview large-preview"
                />
            </div>
        );

    return (
        <div className="signature-comparison-container">
            <div className="signature-container">
                <h3>Загрузите оригинальные подписи</h3>
                {loading && <p className="loading-message">Загрузка подписей...</p>}
                {error && <p className="error-message">{error}</p>}

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "original")}
                    ref={originalInputRef}
                    style={{ display: "none" }}
                />
                <button
                    className="file-upload-button"
                    onClick={() => originalInputRef.current?.click()}
                >
                    Загрузить оригинальные подписи
                </button>

                {signatures.original.length > 0 && (
                    <>
                        <h4>Оригинальные подписи:</h4>
                        <ul>
                            {signatures.original.map((signature) => (
                                <li key={signature.id}>
                                    {signature.name}
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteSignature(signature.id)}
                                    >
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {renderSignatureOptions("original")}
                        {renderPreview("original")}
                    </>
                )}
            </div>

            <div className="signature-container">
                <h3>Загрузите проверяемые подписи</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "test")}
                    ref={testInputRef}
                    style={{ display: "none" }}
                />
                <button
                    className="file-upload-button"
                    onClick={() => testInputRef.current?.click()}
                >
                    Загрузить проверяемые подписи
                </button>

                {signatures.test.length > 0 && (
                    <>
                        <h4>Проверяемые подписи:</h4>
                        {renderSignatureOptions("test")}
                        {renderPreview("test")}
                    </>
                )}
            </div>

            <div className="verify-button-container">
                <button
                    className="verify-button"
                    onClick={handleVerifySignatures}
                    disabled={!selectedSignatures.original || !selectedSignatures.test}
                >
                    Проверить подлинность
                </button>
            </div>
        </div>
    );
};

export default SignatureUploader;
