import React, { useState, useRef } from "react";
import '../App.css';
import { SignaturesApiFactory } from "../json";

const SignatureUploader: React.FC = () => {
    const [originalSignatures, setOriginalSignatures] = useState<Array<{ id: number; name: string; url: string }>>([]);
    const [selectedOriginalSignature, setSelectedOriginalSignature] = useState<string | null>(null);
    const [testSignatures, setTestSignatures] = useState<Array<{ id: number; name: string; url: string }>>([]);
    const [selectedTestSignature, setSelectedTestSignature] = useState<string | null>(null);

    const originalInputRef = useRef<HTMLInputElement | null>(null);
    const testInputRef = useRef<HTMLInputElement | null>(null);
    const signaturesApi = SignaturesApiFactory();

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
                    alert("Подписи успешно загружены");
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
            alert("Подпись успешно удалена");
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
                        <select onChange={(e) => setSelectedOriginalSignature(e.target.value)}>
                            <option value="">-- Выберите оригинальную подпись --</option>
                            {originalSignatures.map(signature => (
                                <option key={signature.id} value={signature.url}>{signature.name}</option>
                            ))}
                        </select>
                        {selectedOriginalSignature && (
                            <div className="preview-container">
                                <h4>Оригинальная подпись:</h4>
                                <img src={selectedOriginalSignature} alt="Original Signature" className="image-preview large-preview" />
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
                        <select onChange={(e) => setSelectedTestSignature(e.target.value)}>
                            <option value="">-- Выберите проверяемую подпись --</option>
                            {testSignatures.map(signature => (
                                <option key={signature.id} value={signature.url}>{signature.name}</option>
                            ))}
                        </select>
                        {selectedTestSignature && (
                            <div className="preview-container">
                                <h4>Проверяемая подпись:</h4>
                                <img src={selectedTestSignature} alt="Test Signature Preview" className="image-preview large-preview" />
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
