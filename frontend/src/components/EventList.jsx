// File: frontend/src/components/EventList.jsx
import React, { useEffect } from 'react';
import H2 from "./ui/H2.jsx";
import useEventStore from "../stores/eventStore.js";
import Card from "./ui/Card.jsx";
import { formatDateTime } from "../utils/dateUtils.js";

function EventList({ groupId }) {
    const {events, isLoading, fetchEvents} = useEventStore();

    useEffect(() => {
        if (!groupId) return;

        fetchEvents(groupId).then();
    }, [groupId, fetchEvents]);

    return (
        <Card>
            <H2>🗓️ Finalized Events</H2>

            {isLoading && <p className="text-gray-400">Loading events...</p>}

            {!isLoading && events.length === 0 && (
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
        </Card>
    );
}

export default EventList;