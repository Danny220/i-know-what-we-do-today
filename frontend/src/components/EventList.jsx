// File: frontend/src/components/EventList.jsx
import React, { useState, useEffect } from 'react';
import apiClient from "../clients/apiClient.js";
import H2 from "./ui/H2.jsx";

function EventList({ groupId }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!groupId) return;
        const fetchEvents = async () => {
            try {
                const response = await apiClient.get(`/groups/${groupId}/events`);
                setEvents(response.data);
            } catch (error) {
                console.error("Error loading events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents().then();
    }, [groupId]);

    const formatDateTime = (isoString) => {
        if (!isoString) return 'Not specified';
        return new Date(isoString).toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
        });
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <H2>🗓️ Finalized Events</H2>

            {loading && <p className="text-gray-400">Loading events...</p>}

            {!loading && events.length === 0 && (
                <p className="text-gray-400">No upcoming events for this group.</p>
            )}

            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-white">{event.title}</h3>
                        <p className="text-sm text-blue-300">{formatDateTime(event.start_time)}</p>
                        <div className="text-sm text-gray-300 mt-2">
                            <p><span className="font-semibold">Where:</span> {event.location_name || 'TBD'}</p>
                            <p><span className="font-semibold">What:</span> {event.activity_name || 'TBD'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventList;