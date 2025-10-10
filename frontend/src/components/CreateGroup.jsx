import React, {useState} from 'react';
import apiClient from "../clients/apiClient.js";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import Input from "./ui/Input.jsx";
import Textarea from "./ui/Textarea.jsx";
import Button from "./ui/Button.jsx";

function CreateGroup() {
    const [groupData, setGroupData] = useState({name: '', description: ''});

    const handleChange = (e) => {
        setGroupData({...groupData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiClient.post('/groups', groupData);

            alert(`Group "${response.data.name}" created successfully!`);

            // Clean form
            setGroupData({name: '', description: ''});
        } catch (err) {
            console.error('Error during group creation!', err);
            alert('Error during group creation!');
        }
    };

    return (
        <Card>
            <H2>Create a new group</H2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="groupName">Group Name:</label>
                    <Input id="groupName" type="text" name="name" value={groupData.name} onChange={handleChange} required/>
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <Textarea id="description" name="description" value={groupData.description} onChange={handleChange} />
                </div>
                <Button type="submit">Create Group</Button>
            </form>
        </Card>
    );
}

export default CreateGroup;