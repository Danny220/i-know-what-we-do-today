import React, {useState} from "react";
import apiClient from "../clients/apiClient.js";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import Label from "./ui/Label.jsx";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";
import toast from "react-hot-toast";
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

        const loginToast = toast.loading('Loading...');

        try {
            const response = await apiClient.post('/auth/login', formData);

            const {token} = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            toast.dismiss(loginToast);
        } catch (error) {
            console.error('Error occurred during login!',   error);
            toast.error(error.response?.data?.message ?? 'Error occurred during login!', {id: loginToast});
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
                <Button type="submit" className="w-full">Login</Button>
            </form>
        </Card>
    )
}

export default Login;