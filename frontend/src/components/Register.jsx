import React, {useState} from "react";
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', formData);

            console.log('User registered successfully!', response.data);
            alert('Registered successfully!');
        } catch (error) {
            console.error("Error occurred during registration!", error);
            alert('Error occurred during registration!');
        }
    };

    return (
        <div>
            <h2>Register now</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;