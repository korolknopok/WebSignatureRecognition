import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import SignatureUploader from './components/SignatureUploader';
import './App.css';
import { Button } from "@mui/material";
import AuthPage from "./Authorization/AuthPage";
import PrivateRoute from "./Authorization/PrivateRoute";

const App: React.FC = () => {
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
    };

    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <div>
                                    {userRole && (
                                        <Button variant="contained" onClick={handleLogout}>
                                            Выйти
                                        </Button>
                                    )}
                                    <SignatureUploader />
                                </div>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
