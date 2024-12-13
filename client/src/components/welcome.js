import React, { useEffect, useState } from 'react';
import '../stylesheets/welcome.css';

export default function Welcome({ api, userMode, onLogin }) {
    const [page, setPage] = useState('welcome');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const getSession = async () => {
        await api.get('/get-session', { withCredentials: true })
            .then(response => {
                const userID = response.data.userID;
                console.log('Relogin Success!');
                onLogin(userID);
            })
            .catch(err => {
                console.log(err.response.data.message);
            });
    };

    useEffect(() => {
        if(!userMode || userMode === 'guest') { // If not logged in, check for session
            if (document.cookie.includes('connect.sid')){
                getSession();
            }
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login', { email, password }, { withCredentials: true });
            const sessionId = res.data.sessionId;
            const userID = res.data.userID;
            console.log('Login Success!');
            onLogin(userID);
        } catch (err) {
            setError('Login failed. ' + err.res.data.error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Throw error if password contains their first name, last name, email, or display name
        if (password.includes(firstName) || password.includes(lastName)){
            setError('Password cannot contain your name!');
            return;
        } else if (password.includes(email.substring(0, email.indexOf('@')))){
            setError('Password cannot contain your email!');
            return;
        } else if (password.includes(displayName)){
            setError('Password cannot contain your display name!');
            return;
        }

        try {
            const res = await api.post('/register', {
                firstName,
                lastName,
                email,
                displayName,
                password,
            }, { withCredentials: true });
            
            console.log('Registery Success!');
            setError('');
            setPage('welcome');
        } catch (err) {
            setError(err.response.data.error);
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
                    <input type="email" placeholder="Email" value={email} 
                        onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} 
                        onChange={(e) => setPassword(e.target.value)} required />
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
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="First Name" 
                    value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <input type="text" placeholder="Last Name" 
                    value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    <input type="email" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="text" placeholder="Display Name"
                    value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                    <input type="password" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="register-btn" type="submit">Sign Up</button>
                </form>
                {error && <p className="error">{error}</p>}
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