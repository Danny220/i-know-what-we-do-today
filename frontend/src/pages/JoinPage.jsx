import React from 'react'
import {useParams, useNavigate} from "react-router-dom";
import apiClient from "../clients/apiClient.js";

function JoinPage() {
    const {inviteCode} = useParams();
    const navigate = useNavigate();

    const handleJoin = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You have to be logged in to join a group!');
                navigate('/');
                return;
            }
            const response = await apiClient.post(`/invites/${inviteCode}/join`);
            alert(response.data.message);
            navigate(`/groups/${response.data.groupId}`);
        } catch (err) {
            console.error("Error joining group", err);
            alert('Error joining group');
        }
    };
    return (
        <div>
            <h2>You are about to join a group</h2>
            <p>Invite Code: {inviteCode}</p>
            <button onClick={handleJoin} style={{fontSize: '1.2em'}}>Join Group</button>
        </div>
    )
}

export default JoinPage;