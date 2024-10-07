import React, { useState, useRef, useEffect } from "react";
import '../App.css';
import { SignaturesApiFactory } from "../json";

const SignatureUploader: React.FC = () => {
    const [originalSignatures, setOriginalSignatures] = useState<Array<{ id: number; name: string; url: string }>>([]);
    const [selectedOriginalSignature, setSelectedOriginalSignature] = useState<string | null>(null);
    const [testSignatures, setTestSignatures] = useState<Array<{ id: number; name: string; url: string }>>([]);
    const [selectedTestSignature, setSelectedTestSignature] = useState<string | null>(null);
    const [previewOriginalImage, setPreviewOriginalImage] = useState<string | null>(null); // Состояние для предварительного просмотра оригинальной подписи
    const [previewTestImage, setPreviewTestImage] = useState<string | null>(null); // Состояние для предварительного просмотра тестовой подписи

    const originalInputRef = useRef<HTMLInputElement | null>(null);
    const testInputRef = useRef<HTMLInputElement | null>(null);
    const signaturesApi = SignaturesApiFactory();

    useEffect(() => {
        const fetchOriginalSignatures = async () => {
            try {
                const response = await signaturesApi.apiSignaturesInformationGetGet(1);
                const fetchedSignatures = response.data.map((sig: any) => ({
                    id: sig.id,
                    name: sig.name,
                    url: `https://localhost:44387/SignaturesImage/1/${sig.name}`,
                }));
                console.log("Fetched Signatures:", fetchedSignatures); // Отладочная информация
                setOriginalSignatures(fetchedSignatures);
            } catch (error) {
                console.log("Ошибка при загрузки оригинальных подписей", error);
            }
        };
        fetchOriginalSignatures();
    }, [signaturesApi]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, isOriginal: boolean) => {
        const files = event.target.files;
        if (files) {
            const newSignatures = Array.from(files).map((file, index) => ({
                id: (isOriginal ? originalSignatures.length : testSignatures.length) + index + 1,
                name: file.name,
                url: URL.createObjectURL(file),
            }));

            if (isOriginal) {
                try {
                    await signaturesApi.apiSignaturesAddPost(1, Array.from(files));
                    setOriginalSignatures(prev => [...prev, ...newSignatures]);
                } catch (error) {
                    console.error("Ошибка при загрузке подписей", error);
                    alert("Не удалось загрузить подписи");
                }
            } else {
                setTestSignatures(prev => [...prev, ...newSignatures]);
            }
        }
    };

    const handleDeleteSignature = async (signatureId: number) => {
        try {
            await signaturesApi.apiSignaturesDeleteSignatureDelete(signatureId);
            setOriginalSignatures(prev => prev.filter(signature => signature.id !== signatureId));
        } catch (error) {
            console.error("Ошибка при удалении подписи", error);
            alert("Не удалось удалить подпись");
        }
    };

    const handleVerifySignatures = () => {
        if (selectedOriginalSignature && selectedTestSignature) {
            alert("Проверка подлинности подписи...");
            // Логика проверки подлинности подписи
        } else {
            alert("Пожалуйста, выберите оригинальную подпись и проверяемую подпись.");
        }
    };

    const handleOriginalSignatureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUrl = event.target.value;
        setSelectedOriginalSignature(selectedUrl);
        setPreviewOriginalImage(selectedUrl); // Устанавливаем URL для предварительного просмотра
    };

    const handleTestSignatureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUrl = event.target.value;
        setSelectedTestSignature(selectedUrl);
        setPreviewTestImage(selectedUrl); // Устанавливаем URL для предварительного просмотра
    };

    return (
        <div className="signature-comparison-container">
            <div className="signature-container">
                <h3>Загрузите оригинальные подписи</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, true)}
                    ref={originalInputRef}
                    style={{ display: "none" }}
                />
                <button className="file-upload-button" onClick={() => originalInputRef.current?.click()}>
                    Загрузить оригинальные подписи
                </button>

                {originalSignatures.length > 0 && (
                    <>
                        <h4>Выберите оригинальную подпись:</h4>
                        <ul>
                            {originalSignatures.map(signature => (
                                <li key={signature.id}>
                                    {signature.name}
                                    <button onClick={() => handleDeleteSignature(signature.id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                        <select onChange={handleOriginalSignatureChange}>
                            <option value="">-- Выберите оригинальную подпись --</option>
                            {originalSignatures.map(signature => (
                                <option key={signature.id} value={signature.url}>{signature.name}</option>
                            ))}
                        </select>
                        {previewOriginalImage && (
                            <div className="preview-container">
                                <h4>Оригинальная подпись:</h4>
                                <img src={previewOriginalImage} alt="Original Signature" className="image-preview large-preview" />
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="signature-container">
                <h3>Загрузите проверяемые подписи</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, false)}
                    ref={testInputRef}
                    style={{ display: "none" }}
                />
                <button className="file-upload-button" onClick={() => testInputRef.current?.click()}>
                    Загрузить проверяемые подписи
                </button>

                {testSignatures.length > 0 && (
                    <>
                        <h4>Выберите проверяемую подпись:</h4>
                        <select onChange={handleTestSignatureChange}>
                            <option value="">-- Выберите проверяемую подпись --</option>
                            {testSignatures.map(signature => (
                                <option key={signature.id} value={signature.url}>{signature.name}</option>
                            ))}
                        </select>
                        {previewTestImage && (
                            <div className="preview-container">
                                <h4>Проверяемая подпись:</h4>
                                <img src={previewTestImage} alt="Test Signature Preview" className="image-preview large-preview" />
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="verify-button-container">
                <button
                    className="verify-button"
                    onClick={handleVerifySignatures}
                    disabled={!selectedOriginalSignature || !selectedTestSignature}
                >
                    Проверить подлинность
                </button>
            </div>
        </div>
    );
};

export default SignatureUploader;

