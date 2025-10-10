import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from "react-router-dom";
import apiClient from "../clients/apiClient.js";
import H2 from "../components/ui/H2.jsx";
import Button from "../components/ui/Button.jsx";

function JoinPage() {
    const {inviteCode} = useParams();
    const navigate = useNavigate();

    const [groupNmae, setGroupName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        const fetchInviteDetails = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/invites/${inviteCode}`);
                setGroupName(response.data.group_name);
            } catch (err) {
                console.error("Error fetching invite details", err);
                setError("This invite link is invalid or has expired.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchInviteDetails().then();
    }, [inviteCode]);
    const handleJoin = async () => {
        setIsJoining(true);
        try {
            const response = await apiClient.post(`/invites/${inviteCode}/join`);
            navigate(`/groups/${response.data.groupId}`);
        } catch (err) {
            console.error("Error joining group", err);
            setError(err.response?.data?.message || 'Failed to join the group.');
        } finally {
            setIsJoining(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-gray-400">Loading invite...</p>
        }
        if (error) {
            return <p className="text-red-400">{error}</p>
        }
        return (
            <>
                <H2>You've been invited!</H2>
                <p className="text-gray-300 text-center mb-6">
                    You are about to join the group: <strong className="text-white">{groupNmae}</strong>
                </p>
                <Button onClick={handleJoin} disabled={isJoining}>
                    {isJoining ? 'Joining...' : 'Join Group'}
                </Button>
            </>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                {renderContent()}
            </div>
        </div>
    )
}

export default JoinPage;