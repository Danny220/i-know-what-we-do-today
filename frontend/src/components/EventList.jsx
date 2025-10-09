import React, { useState } from 'react';
import axios from 'axios';

function EventList() {
    const [groupId, setGroupId] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        if (!groupId) return;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`http://localhost:3001/api/groups/${groupId}/events`, config);
            setEvents(response.data);
        } catch (err) {
            console.error("Error loading events", err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('it-IT', { // TODO: internationalize
            dateStyle: 'full',
            timeStyle: 'short'
        });
    }

    return (
        <div>
            <hr style={{margin: '20px 0'}}/>
            <h2>🗓️ Calendar of the Group</h2>
            <div>
                <input type="text" value={groupId} onChange={e => setGroupId(e.target.value)} placeholder="Insert group ID to see events" />
                <button onClick={fetchEvents}>Load events</button>
            </div>

            {loading && <p>Loading....</p>}

            {events.length === 0 && !loading && (
                <p>No events found for this group</p>
            )}

            <div style={{marginTop: '20px'}}>
                {events.map(event => (
                    <div key={event.id} style={{border: '1px solid #444', padding: '15px', margin: '10px 0', borderRadius: '8px'}}>
                        <h3>{event.title}</h3>
                        <p><strong>When:</strong> {formatDateTime(event.start_time)}</p>
                        <p><strong>Where:</strong> {event.location_name ?? 'N/A'}</p>
                        <p><strong>What:</strong> {event.activity_name ?? 'N/A'}</p>
                        {event.description && <p><em>{event.description}</em></p>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EventList;