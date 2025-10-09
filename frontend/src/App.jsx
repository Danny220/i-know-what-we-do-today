import React from 'react'
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GroupList from "./components/GroupList.jsx";
import EventList from "./components/EventList.jsx";
import Polls from "./components/Polls.jsx";
import CreatePoll from "./components/CreatePoll.jsx";
import './App.css';

function GroupDetailPage() {
    return (
        <div>
                <EventList />
                <Polls />
                <CreatePoll />
        </div>
    )
}

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav style={{marginBottom: '20px'}}>
                        <Link to="/" style={{marginRight: '15px'}}>Home</Link>
                    </nav>

                    <h1>I Know What We'll Do Today</h1>

                    <Routes>
                        <Route path="/" element={<GroupList />} />
                        <Route path="/groups/:groupId" element={<GroupDetailPage />} />
                    </Routes>
                </header>
            </div>
        </Router>
    )
}

export default App;