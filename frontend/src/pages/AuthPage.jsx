import React from "react";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import H1 from "../components/ui/H1.jsx";

function AuthPage({setToken}) {
    return (
        <div className="flex flex-col items-center justify-center pt-12">
            <div className="text-center mb-12">
               <H1>Organize your outings.</H1>
                <p className="text-lg text-gray-400 mt-2">
                    Stop asking "What are we doing tonight?". Decide together.
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <Register />
                <Login setToken={setToken} />
            </div>
        </div>
    );
}

export default AuthPage;