import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import Polls from '../components/Polls';
import EventList from '../components/EventList';
import CreatePoll from '../components/CreatePoll';
import apiClient from "../clients/apiClient.js";

function GroupDetailPage() {
    const { groupId } = useParams();
    const [inviteCode, setInviteCode] = useState('');

    const handleGenerateInvite = async () => {
        try {
            const response = await apiClient.post(`/groups/${groupId}/invites`);
            setInviteCode(response.data.inviteCode);
        } catch (err) {
            console.error("Error generating invite", err);
            alert('Error generating invite');
        }
    }

    return (
        <div>
            <h2>Group Details: {groupId}</h2>
            <button onClick={handleGenerateInvite}>Generate Invite Link</button>
            {inviteCode && (
                <p>
                    Invite Code: <strong>{inviteCode}</strong>
                    <br />
                    Share this link: <code>{window.location.origin}/join/{inviteCode}</code>
                </p>
            )}

            <EventList groupId={groupId} />
            <Polls groupId={groupId} />
            <CreatePoll groupId={groupId} />
        </div>
    )
}

export default GroupDetailPage;