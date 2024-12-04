import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Tabs, Tab } from '@mui/material';
import axios from 'axios';

const AuthPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5098/Authentication/Register', null, {
                params: { username, email, password }
            });
            if (response.status === 200) {
                setError(null);
                setTab(0);
            }
        } catch (error) {
            setError('Ошибка при регистрации');
            console.error("Ошибка при регистрации", error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5098/Authentication/Login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/');
            }
        } catch (error) {
            setError('Неверное имя пользователя или пароль');
            console.error("Ошибка при авторизации", error);
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
                <Tabs value={tab} onChange={handleChange} aria-label="auth tabs">
                    <Tab label="Войти" />
                    <Tab label="Регистрация" />
                </Tabs>
                {tab === 0 && (
                    <>
                        <Typography variant="h6" component="h2">
                            Авторизация
                        </Typography>
                        {error && <Typography color="error">{error}</Typography>}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Почта пользователя"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                    </>
                )}
                {tab === 1 && (
                    <>
                        <Typography variant="h6" component="h2">
                            Регистрация
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
                            label="Email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                            onClick={handleRegister}
                        >
                            Зарегистрироваться
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AuthPage;
