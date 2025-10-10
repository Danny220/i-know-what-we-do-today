import React, {useState} from "react";
import apiClient from "../clients/apiClient.js";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import Label from "./ui/Label.jsx";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";
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
        } catch (error) {
            console.error('Error occurred during login!',   error);
            alert(error.response?.data?.message ?? 'Error occurred during login!');
        }
    };

    return (
        <Card className="max-w-md">
            <H2>Log In</H2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <Label>Email:</Label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </div>
                <div>
                    <Label>Password:</Label>
                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                </div>
                <Button type="submit">Login</Button>
            </form>
        </Card>
    )
}

export default Login;