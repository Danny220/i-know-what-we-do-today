import React from "react";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";

function AuthPage({setToken}) {
    return (
        <div>
            <h2>Login or Register</h2>
            <div style={{display: 'flex', gap: '50px'}}>
                <Register />
                <Login setToken={setToken} />
            </div>
        </div>
    );
}

export default AuthPage;