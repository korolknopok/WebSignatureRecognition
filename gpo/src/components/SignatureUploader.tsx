import React, { useState, useRef } from "react";
import '../App.css';

const SignatureUploader: React.FC<{ onUpload: (file: File) => void }> = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            onUpload(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click(); // Имитация клика по скрытому input
    };

    return (
        <div className="container">
            <h2 className= "containerName">Проверка подлинности подписи</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }} // Скрываем input
            />

            <button className="file-upload-button" onClick={handleButtonClick}>
                Выберите файл
            </button>

            {previewUrl && (
                <div className="preview-container">
                    <h4>Предпросмотр:</h4>
                    <img src={previewUrl} alt="Signature Preview" className="image-preview" />
                </div>
            )}

            {selectedFile && (
                <button className="submit-button" onClick={() => alert("Submitting signature...")}>
                    Отправить
                </button>
            )}
        </div>
    );
};

export default SignatureUploader;
