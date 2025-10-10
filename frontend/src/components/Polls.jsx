// File: frontend/src/components/Polls.jsx
import React, { useState, useEffect } from 'react';
import apiClient from "../clients/apiClient.js";
import Button from "./ui/Button.jsx";
import H2 from "./ui/H2.jsx";

function Polls({ groupId }) {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPolls = async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const response = await apiClient.get(`/groups/${groupId}/polls`);
            setPolls(response.data);
        } catch (error) {
            console.error("Error loading polls", error);
            setPolls([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls().then();
    }, [groupId]);

    const handleVote = async (pollId, optionId) => {
        try {
            await apiClient.post(`/groups/${groupId}/polls/${pollId}/vote`, { optionId });
            alert('Vote registered!');
            // TODO: refresh the poll data to show vote counts
        } catch (error) {
            console.error("Error while voting", error);
            alert('Vote failed.');
        }
    };

    const handleFinalize = async (pollId) => {
        try {
            const response = await apiClient.post(`/groups/${groupId}/polls/${pollId}/finalize`);
            alert(response.data.message);
            await fetchPolls(); // Refresh polls to update status
        } catch (error) {
            console.error("Error during finalization", error);
            alert('Finalization failed: ' + (error.response?.data?.message || 'Please try again.'));
        }
    };

    const renderOptions = (poll, type) => {
        return poll.options
            .filter(opt => opt.type === type)
            .map(opt => (
                <Button
                    key={opt.id}
                    onClick={() => handleVote(poll.id, opt.id)}
                    className="px-3 py-1 bg-gray-600 text-sm rounded-full hover:bg-blue-600 transition-colors"
                >
                    {opt.value}
                </Button>
            ));
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <H2>📣 Open Polls</H2>

            {loading && <p className="text-gray-400">Loading polls...</p>}

            {!loading && polls.length === 0 && (
                <p className="text-gray-400">No open polls in this group.</p>
            )}

            <div className="space-y-6">
                {polls.map(poll => (
                    <div key={poll.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-white">{poll.title}</h3>
                                <p className="text-sm text-gray-400">{poll.description}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                poll.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-gray-500 text-gray-100'
                            }`}>
                                {poll.status}
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Times:</h4>
                                <div className="flex flex-wrap gap-2">{renderOptions(poll, 'TIME')}</div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Locations:</h4>
                                <div className="flex flex-wrap gap-2">{renderOptions(poll, 'LOCATION')}</div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Activities:</h4>
                                <div className="flex flex-wrap gap-2">{renderOptions(poll, 'ACTIVITY')}</div>
                            </div>
                        </div>

                        {poll.status === 'open' && (
                            <div className="mt-4 border-t border-gray-600 pt-4">
                                <Button
                                    onClick={() => handleFinalize(poll.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Finalize and Create Event
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Polls;