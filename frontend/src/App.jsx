import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import GroupList from "./components/GroupList.jsx";
import EventList from "./components/EventList.jsx";
import Polls from "./components/Polls.jsx";
import CreatePoll from "./components/CreatePoll.jsx";
import './App.css';
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GroupDetailPage from "./pages/GroupDetailPage.jsx";
import JoinPage from "./pages/JoinPage.jsx";

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    }

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav style={{ padding: '1rem', background: '#20232a', width: '100%' }}>
                        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
                        {token && <button onClick={handleLogout}>Logout</button>}
                    </nav>

                    <h1>I Know What We'll Do Today</h1>

                    <Routes>
                        <Route path="/" element={
                            !token ? <AuthPage setToken={setToken} /> : <Navigate to="/dashboard" />
                        }/>
                        <Route path="/dashboard" element={
                            token ? <DashboardPage /> : <Navigate to="/" />
                        }/>
                        <Route path="/groups/:groupId" element={
                            token ? <GroupDetailPage /> : <Navigate to="/" />
                        }/>
                        <Route path="/join/:inviteCode" element={
                            <JoinPage />
                        }/>
                    </Routes>
                </header>
            </div>
        </Router>
    )
}

export default App;