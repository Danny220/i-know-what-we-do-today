import React, {useState} from 'react';
import axios from "axios";

function CreateGroup() {
    const [groupData, setGroupData] = useState({name: '', description: ''});

    const handleChange = (e) => {
        setGroupData({...groupData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You are not logged in!');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.post('http://localhost:3001/api/groups', groupData, config);

            alert(`Group "${response.data.name}" created successfully!`);

            // Clean form
            setGroupData({name: '', description: ''});
        } catch (err) {
            console.error('Error during group creation!', err);
            alert('Error during group creation!');
        }
    };

    return (
        <div>
            <hr style={{margin: '20px 0'}}/>
            <h2>Create a new group</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Group Name:</label>
                    <input type="text" name="name" value={groupData.name} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={groupData.description} onChange={handleChange} />
                </div>
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
}

export default CreateGroup;