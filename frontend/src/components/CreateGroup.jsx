import React, {useState} from 'react';
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import Input from "./ui/Input.jsx";
import Textarea from "./ui/Textarea.jsx";
import Button from "./ui/Button.jsx";
import useGroupStore from "../stores/groupStore.js";

function CreateGroup() {
    const [groupData, setGroupData] = useState({name: '', description: ''});
    const createGroup = useGroupStore(state => state.createGroup);

    const handleChange = (e) => {
        setGroupData({...groupData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createGroup(groupData);
        alert(`Group "${groupData.name}" created successfully!`);
        setGroupData({name: '', description: ''});
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
                <Button type="submit" className="w-full">Create Group</Button>
            </form>
        </Card>
    );
}

export default CreateGroup;