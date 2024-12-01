import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <header className="navbar">
            <div className="logo">
                <span className="site-name">SignatureChecker</span>
            </div>
            <nav className="navbar-buttons">
                <button className="nav-button" onClick={() => navigate('/')}>Главная</button>
                <button className="nav-button">О нас</button>
                <button className="nav-button">Контакты</button>
                <button className="nav-button" onClick={handleLogout}>Выйти</button>
            </nav>
        </header>
    );
};

export default Header;
