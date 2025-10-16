import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Polls from '../components/Polls';
import EventList from '../components/EventList';
import CreatePoll from '../components/CreatePoll';
import apiClient from "../clients/apiClient.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import MemberList from "../components/MemberList.jsx";
import {formatDate} from "../utils/dateUtils.js";
import useGroupDetailStore from "../stores/groupDetailStore.js";
import GroupSettings from "../components/GroupSettings.jsx";

function GroupDetailPage() {
    const { groupId } = useParams();
    const {group, isLoading, fetchGroupDetails} = useGroupDetailStore();
    const [inviteCode, setInviteCode] = useState('');

    useEffect(() => {
        fetchGroupDetails(groupId).then();
    }, [groupId, fetchGroupDetails]);
    const handleGenerateInvite = async () => {
        try {
            const response = await apiClient.post(`invites/groups/${groupId}`);
            setInviteCode(response.data.inviteCode);
        } catch (err) {
            console.error("Error generating invite", err);
            alert('Error generating invite');
        }
    }

    if (isLoading) {
        return <div className="text-center py-10">Loading group details...</div>
    }

    if (!group) {
        return <div className="text-center py-10 text-red-400">Group not found</div>
    }

    return (
        <Container>
            <div className="mb-8">
                <Link to="/dashboard" className="text-sm text-blue-400 hover:underline">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-bold mt-2">{group.name}</h1>
                <p className="text-gray-400 mt-1">{group.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                    Created by <strong>{group.created_by}</strong> on {formatDate(group.created_at)}
                </p>
            </div>

            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <Button onClick={handleGenerateInvite} className="bg-green-600 hover:bg-green-700 w-full">Generate Invite Link</Button>
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
                <div className="lg:col-span-2 gap-8 grid grid-cols-1 md:grid-cols-2">
                    <EventList groupId={groupId} />
                    <Polls groupId={groupId} />
                </div>
                <div className="lg:col-span-2 gap-8 grid grid-cols-1 md:grid-cols-2">
                    <CreatePoll groupId={groupId} />
                    <MemberList groupId={groupId}></MemberList>
                    {group && <GroupSettings group={group} />}
                </div>
            </div>
        </Container>
    )
}

export default GroupDetailPage;