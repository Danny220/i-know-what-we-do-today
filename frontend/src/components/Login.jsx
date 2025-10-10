import React, {useState} from "react";
import apiClient from "../clients/apiClient.js";
function Login({setToken}) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/login', formData);

            const {token} = response.data;
            localStorage.setItem('token', token);
            setToken(token);

            console.log('User successfully logged in!', token);
            alert('User successfully logged in!');
        } catch (error) {
            console.error('Error occurred during login!',   error);
            alert(error.response?.data?.message ?? 'Error occurred during login!');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;