import React, { useState, useRef } from "react";
import '../App.css';

const SignatureUploader: React.FC<{ onUpload: (file: File) => void }> = ({ onUpload }) => {
    const [originalSignatures, setOriginalSignatures] = useState<Array<{ id: number; name: string; url: string }>>([]);
    const [selectedOriginalSignature, setSelectedOriginalSignature] = useState<string | null>(null);

    const [testSignatures, setTestSignatures] = useState<Array<{ id: number; name: string; url: string }>>([]);
    const [selectedTestSignature, setSelectedTestSignature] = useState<string | null>(null);

    const originalInputRef = useRef<HTMLInputElement | null>(null);
    const testInputRef = useRef<HTMLInputElement | null>(null);

    // Обработка загрузки оригинальных подписей
    const handleOriginalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newSignatures = Array.from(files).map((file, index) => ({
                id: originalSignatures.length + index + 1,
                name: file.name,
                url: URL.createObjectURL(file)
            }));
            setOriginalSignatures((prevSignatures) => [...prevSignatures, ...newSignatures]);
        }
    };

    // Обработка загрузки проверяемых подписей
    const handleTestFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newSignatures = Array.from(files).map((file, index) => ({
                id: testSignatures.length + index + 1,
                name: file.name,
                url: URL.createObjectURL(file)
            }));
            setTestSignatures((prevSignatures) => [...prevSignatures, ...newSignatures]);
        }
    };

    const handleTestButtonClick = () => {
        testInputRef.current?.click(); // Имитация клика по скрытому input для проверяемых подписей
    };

    const handleOriginalButtonClick = () => {
        originalInputRef.current?.click(); // Имитация клика по скрытому input для оригинальных подписей
    };

    // Обработка выбора оригинальной подписи
    const handleOriginalSignatureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOriginalSignature(event.target.value);
    };

    // Обработка выбора проверяемой подписи
    const handleTestSignatureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTestSignature(event.target.value);
    };

    const handleVerifySignatures = () => {
        if (selectedOriginalSignature && selectedTestSignature) {
            alert("Проверка подлинности подписи...");
            // Здесь может быть логика для проверки подлинности подписи
        } else {
            alert("Пожалуйста, выберите оригинальную подпись и проверяемую подпись.");
        }
    };

    return (
        <div className="signature-comparison-container">
            {/* Левый блок - загрузка и выбор оригинальных подписей */}
            <div className="signature-container">
                <h3>Загрузите оригинальные подписи</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleOriginalFileChange}
                    ref={originalInputRef}
                    style={{ display: "none" }} // Скрываем input
                />
                <button className="file-upload-button" onClick={handleOriginalButtonClick}>
                    Загрузить оригинальные подписи
                </button>

                {originalSignatures.length > 0 && (
                    <>
                        <h4>Выберите оригинальную подпись:</h4>
                        <select onChange={handleOriginalSignatureChange}>
                            <option value="">-- Выберите оригинальную подпись --</option>
                            {originalSignatures.map((signature) => (
                                <option key={signature.id} value={signature.url}>
                                    {signature.name}
                                </option>
                            ))}
                        </select>

                        {selectedOriginalSignature && (
                            <div className="preview-container">
                                <h4>Оригинальная подпись:</h4>
                                <img
                                    src={selectedOriginalSignature}
                                    alt="Original Signature"
                                    className="image-preview large-preview"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Правый блок - загрузка и выбор проверяемых подписей */}
            <div className="signature-container">
                <h3>Загрузите проверяемые подписи</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleTestFileChange}
                    ref={testInputRef}
                    style={{ display: "none" }} // Скрываем input
                />
                <button className="file-upload-button" onClick={handleTestButtonClick}>
                    Загрузить проверяемые подписи
                </button>

                {testSignatures.length > 0 && (
                    <>
                        <h4>Выберите проверяемую подпись:</h4>
                        <select onChange={handleTestSignatureChange}>
                            <option value="">-- Выберите проверяемую подпись --</option>
                            {testSignatures.map((signature) => (
                                <option key={signature.id} value={signature.url}>
                                    {signature.name}
                                </option>
                            ))}
                        </select>

                        {selectedTestSignature && (
                            <div className="preview-container">
                                <h4>Проверяемая подпись:</h4>
                                <img
                                    src={selectedTestSignature}
                                    alt="Test Signature Preview"
                                    className="image-preview large-preview"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Кнопка проверки подлинности */}
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
