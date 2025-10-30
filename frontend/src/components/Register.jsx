import React, {useState} from "react";
import apiClient from "../clients/apiClient.js";
import Label from "./ui/Label.jsx";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import toast from "react-hot-toast";

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

        const registerToast = toast.loading('Loading...');

        try {
            await apiClient.post('/auth/register', formData);
            toast.success('Registration successful! You can now log in.', {id: registerToast});
        } catch (error) {
            console.error("Error occurred during registration!", error);
            toast.error('Error occurred during registration!', {id: registerToast} );
        }
    };

    return (
        <Card className="max-w-md">
            <H2>Create an Account</H2>
            <form className="space-y-6"  onSubmit={handleSubmit}>
                <div>
                    <Label>Username:</Label>
                    <Input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Email:</Label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Password:</Label>
                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                <Button type="submit" className="w-full">Register</Button>
            </form>
        </Card>
    );
}

export default Register;