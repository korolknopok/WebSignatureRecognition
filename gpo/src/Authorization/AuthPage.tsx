import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

const AuthPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('token', 'admin-token');
            navigate('/');
        } else if (username === 'user' && password === 'user') {
            localStorage.setItem('token', 'user-token');
            navigate('/');
        } else {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 8,
                }}
            >
                <Typography variant="h6" component="h2">
                    Авторизация
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Имя пользователя"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Пароль"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
                >
                    Войти
                </Button>
            </Box>
        </Box>
    );
};

export default AuthPage;
