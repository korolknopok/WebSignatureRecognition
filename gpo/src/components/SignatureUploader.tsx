import React, { useState, useRef, useEffect, useMemo } from "react";
import '../App.css';
import { GetSignaturesInfoResponse, SignaturesApiFactory } from "../json";

interface Signature {
    id: number;
    name: string;
    url: string;
}

const SignatureUploader: React.FC = () => {
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

    const [loading, setLoading] = useState<boolean>(false); // состояние загрузки подписей
    const [error, setError] = useState<string | null>(null); // состояние ошибки

    const originalInputRef = useRef<HTMLInputElement | null>(null);
    const testInputRef = useRef<HTMLInputElement | null>(null);

    const signaturesApi = useMemo(() => SignaturesApiFactory(), []);

    // Загрузка оригинальных подписей
    useEffect(() => {
        const fetchOriginalSignatures = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await signaturesApi.apiSignaturesInformationGetGet(1);

                const fetchedSignatures: Signature[] = response.data.map((sig: GetSignaturesInfoResponse) => ({
                    id: sig.id ?? 0,
                    name: sig.name || "Unknown",
                    url: `https://localhost:44387/SignaturesImage/1/${sig.name || 'unknown'}`,
                }));

                setSignatures(prev => ({ ...prev, original: fetchedSignatures }));
            } catch (error) {
                setError("Ошибка при загрузке оригинальных подписей");
                console.error("Ошибка при загрузке оригинальных подписей", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOriginalSignatures();
    }, [signaturesApi]);

    // Обработка изменения файла (загрузка подписей)
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'original' | 'test'
    ) => {
        const files = event.target.files;
        if (files) {
            const newSignatures: Signature[] = Array.from(files).map((file, index) => ({
                id: signatures[type].length + index + 1,
                name: file.name,
                url: URL.createObjectURL(file),
            }));

            if (type === 'original') {
                try {
                    await signaturesApi.apiSignaturesAddPost(1, Array.from(files));
                } catch (error) {
                    console.error("Ошибка при загрузке подписей", error);
                    alert("Не удалось загрузить подписи");
                    return;
                }
            }

            setSignatures(prev => ({
                ...prev,
                [type]: [...prev[type], ...newSignatures],
            }));
        }
    };

    // Удаление подписи
    const handleDeleteSignature = async (signatureId: number) => {
        try {
            await signaturesApi.apiSignaturesDeleteSignatureDelete(signatureId);
            setSignatures(prev => ({
                ...prev,
                original: prev.original.filter(signature => signature.id !== signatureId),
            }));
        } catch (error) {
            console.error("Ошибка при удалении подписи", error);
            alert("Не удалось удалить подпись");
        }
    };

    const handleSelectSignature = (type: 'original' | 'test', url: string) => {
        setSelectedSignatures(prev => ({ ...prev, [type]: url }));
        setPreviews(prev => ({ ...prev, [type]: url }));
    };

    const handleVerifySignatures = () => {
        if (selectedSignatures.original && selectedSignatures.test) {
            alert("Проверка подлинности подписи...");
        } else {
            alert("Пожалуйста, выберите оригинальную подпись и проверяемую подпись.");
        }
    };

    const renderSignatureOptions = (type: 'original' | 'test') => (
        <select onChange={(e) => handleSelectSignature(type, e.target.value)}>
            <option value="">-- Выберите подпись --</option>
            {signatures[type].map(signature => (
                <option key={signature.id} value={signature.url}>{signature.name}</option>
            ))}
        </select>
    );

    const renderPreview = (type: 'original' | 'test') => (
        previews[type] && (
            <div className="preview-container">
                <h4>{type === 'original' ? 'Оригинальная подпись:' : 'Проверяемая подпись:'}</h4>
                <img src={previews[type]!} alt={`${type} Signature`} className="image-preview large-preview" />
            </div>
        )
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
                    onChange={(e) => handleFileChange(e, 'original')}
                    ref={originalInputRef}
                    style={{ display: "none" }}
                />
                <button className="file-upload-button" onClick={() => originalInputRef.current?.click()}>
                    Загрузить оригинальные подписи
                </button>

                {signatures.original.length > 0 && (
                    <>
                        <h4>Выберите оригинальную подпись:</h4>
                        <ul>
                            {signatures.original.map(signature => (
                                <li key={signature.id}>
                                    {signature.name}
                                    <button className="delete-button" onClick={() => handleDeleteSignature(signature.id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                        {renderSignatureOptions('original')}
                        {renderPreview('original')}
                    </>
                )}
            </div>

            <div className="signature-container">
                <h3>Загрузите проверяемые подписи</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, 'test')}
                    ref={testInputRef}
                    style={{ display: "none" }}
                />
                <button className="file-upload-button" onClick={() => testInputRef.current?.click()}>
                    Загрузить проверяемые подписи
                </button>

                {signatures.test.length > 0 && (
                    <>
                        <h4>Выберите проверяемую подпись:</h4>
                        {renderSignatureOptions('test')}
                        {renderPreview('test')}
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
