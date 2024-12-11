import React, { useEffect, useState } from 'react';
import '../stylesheets/welcome.css';


export default function Welcome({ api, model, onLogin }) {
    const [page, setPage] = useState('welcome');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log(document.cookie.split(';'));
        const sessionCookie = document.cookie.split(';').find(cookie => cookie.startsWith('sessionId'));
        api.get('/get-session', { withCredentials: true })
            .then(response => {
                const sessionId = response.data.sessionId;
                onLogin(sessionId);
            })
            .catch(err => {
                console.log(err.status);
            })
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password }, { withCredentials: true });
            const sessionId = response.data.sessionId;
            console.log('sessionId: ', sessionId);
            onLogin(sessionId);
        } catch (err) {
            setError('Login failed. ' + err.response.data.error);
        }
    };

    const renderWelcomePage = () => (
        <div className="welcome-page">
            <div className="welcome-container">
                <h1>Welcome to Phreddit</h1>
                <button className="login-btn" onClick={() => setPage('login')}>Login</button>
                <button className="register-btn" onClick={() => setPage('register')}>Register</button>
                <button className="guest-btn" onClick={() => onLogin('guest')}>Continue as Guest</button>
            </div>
        </div>
    );

    const renderLoginPage = () => (
        <div className="welcome-page">
            <div className="welcome-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button className="login-btn" type="submit">Login</button>
                </form>
                {error && <p className="error">{error}</p>}
                <button className="register-btn" onClick={() => setPage('welcome')}>Back</button>
            </div>
        </div>
    );

    const renderRegisterPage = () => (
        <div className="welcome-page">
            <div className="welcome-container">
                <h1>Register</h1>
                <form onSubmit={(e) => { e.preventDefault(); onLogin('home'); }}>
                    <input type="text" placeholder="First Name" required />
                    <input type="text" placeholder="Last Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="text" placeholder="Username" required />
                    <input type="password" placeholder="Password" required />
                    <button className="register-btn" type="submit">Register</button>
                </form>
                <button className="login-btn" onClick={() => setPage('welcome')}>Back</button>
            </div>
        </div>
    );

    return (
        <div>
            {page === 'welcome' && renderWelcomePage()}
            {page === 'login' && renderLoginPage()}
            {page === 'register' && renderRegisterPage()}
        </div>
    );
}