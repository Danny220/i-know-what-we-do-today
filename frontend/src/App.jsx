import React from "react";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import './App.css'
import CreateGroup from "./components/CreateGroup.jsx";
import GroupList from "./components/GroupList.jsx";
import CreatePoll from "./components/CreatePoll.jsx";
import Polls from "./components/Polls.jsx";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div style={{display: 'flex', flexDirection: 'column', gap:'0'}}>
                    <h1 style={{margin: '0'}}>IKWWDT</h1>
                    <p style={{margin: '0'}}>i know what we do today</p>
                </div>
                <div style={{display: 'flex', gap: '50px'}}>
                    <Register />
                     <Login />
                </div>
                <GroupList />
                <CreateGroup />
                <CreatePoll />
                <Polls />
            </header>
        </div>
    );
}

export default App;