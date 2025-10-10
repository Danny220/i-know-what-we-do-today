import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Polls from '../components/Polls';
import EventList from '../components/EventList';
import CreatePoll from '../components/CreatePoll';
import apiClient from "../clients/apiClient.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";

function GroupDetailPage() {
    const { groupId } = useParams();
    const [inviteCode, setInviteCode] = useState('');
    const [group, setGroup] = useState(null);

    useEffect(() => {
        // TODO: fetch group details
    }, [groupId]);
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
        <Container>
            <div className="mb-8">
                <Link to="/dashboard" className="text-sm text-blue-400 hover:underline">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-bold mt-2">Group Details</h1>
                <p className="text-sm text-gray-500 mt-1">ID: {groupId}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <Button onClick={handleGenerateInvite} className="bg-green-600 hover:bg-green-700">Generate Invite Link</Button>
                {inviteCode && (
                    <div className="mt-4 p-3 bg-gray-700 rounded">
                        <p className="text-sm text-gray-300">Share this link with your friends:</p>
                        <code className="text-white bg-gray-900 p-2 rounded block mt-1 break-all">
                            {window.location.origin}/join/{inviteCode}
                        </code>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <EventList groupId={groupId} />
                    <Polls groupId={groupId} />
                </div>
                <div>
                    <CreatePoll groupId={groupId} />
                </div>
            </div>
        </Container>
    )
}

export default GroupDetailPage;