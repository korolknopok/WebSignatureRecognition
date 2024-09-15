import React from 'react';
import './Header.css'; // Подключаем стили для Header

const Header: React.FC = () => {
    return (
        <header className="navbar">
            <div className="logo">
                <span className="site-name">SignatureChecker</span>
            </div>
            <nav className="navbar-buttons">
                <button className="nav-button">Главная</button>
                <button className="nav-button">О нас</button>
                <button className="nav-button">Контакты</button>
            </nav>
        </header>
    );
};

export default Header;
