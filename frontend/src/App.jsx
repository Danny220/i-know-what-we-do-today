import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import './App.css';
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GroupDetailPage from "./pages/GroupDetailPage.jsx";
import JoinPage from "./pages/JoinPage.jsx";
import MenuLink from "./components/ui/MenuLink.jsx";
import Button from "./components/ui/Button.jsx";
import Notifications from "./components/Notifications.jsx";

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

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
            <div className="bg-gray-900 text-white min-h-screen">
                <nav className="bg-gray-800 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <MenuLink to="/">I Know What We'll Do Today</MenuLink>
                            <p className="font-bold text-xl text-orange-700">!!! PRE ALPHA !!!</p>
                            <div className="flex items-center gap-4">
                                {token && <Notifications />}
                                {token && (
                                    <Button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                                    >
                                        Logout
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

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
            </div>
        </Router>
    )
}

export default App;