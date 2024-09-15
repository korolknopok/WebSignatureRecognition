import React from "react";
import SignatureUploader from "./components/SignatureUploader";
import './App.css';
import Header from "./Header";
const App: React.FC = () => {
  // Функция для обработки загруженного файла (например, отправка на сервер)
  const handleFileUpload = (file: File) => {
    console.log("Uploaded file:", file);
    // Здесь можно добавить логику отправки файла на бэкенд
  };

  return (
      <div className="App">
        <Header/>
        <SignatureUploader onUpload={handleFileUpload} />
      </div>
  );
};

export default App;
