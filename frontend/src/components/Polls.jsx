import React, { useState } from 'react';
import axios from 'axios';

function Polls() {
    const [groupId, setGroupId] = useState('');
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPolls = async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`http://localhost:3001/api/groups/${groupId}/polls`, config);
            setPolls(response.data);
        } catch (err) {
            console.error("Error loading polls", err);
            setPolls([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId, optionId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:3001/api/groups/${groupId}/polls/${pollId}/vote`, {optionId}, config);
            alert('Vote successfully registered');
            await fetchPolls();
        } catch (err) {
            console.error("Error voting poll", err);
            alert('Vote failed');
        }
    };

    const handleFinalize = async (pollId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(`http://localhost:3001/api/groups/${groupId}/polls/${pollId}/finalize`, {}, config);
            alert(response.data.message);
            await fetchPolls();
        } catch (err) {
            console.error("Error finalizing poll", err);
            alert('Error finalizing poll ' + (err.response?.data?.message ?? 'Retry later.'));
        }
    }

    const renderOptions = (poll, type) => {
        return poll.options.filter(opt => opt.type === type).map(opt => (
            <button key={opt.id} onClick={() => handleVote(poll.id, opt.id)}>{opt.value}</button>
        ))
    };

    return (
        <div>
            <hr style={{margin: '20px 0'}}/>
            <h2>Group's poll</h2>
            <div>
                <input
                    type="text"
                    value={groupId}
                    onChange={e => setGroupId(e.target.value)}
                    placeholder="Insert group ID to see polls" />
                <button onClick={fetchPolls}>Load polls</button>
            </div>

            {loading && <p>Loading....</p>}

            {polls.map(poll => (
                <div key={poll.id} style={{border: '1px solid grey', padding: '10px', margin: '10px 0'}}>
                    <h3>{poll.title}</h3>
                    <p>{poll.description}</p>

                    <h4>Time:</h4>
                    <div>{renderOptions(poll, 'TIME')}</div>

                    <h4>Location:</h4>
                    <div>{renderOptions(poll, 'LOCATION')}</div>

                    <h4>Activities:</h4>
                    <div>{renderOptions(poll, 'ACTIVITY')}</div>

                    {poll.status === 'open' && (
                        <button onClick={() => handleFinalize(poll.id)} style={{marginTop: '10px', backgroundColor: 'green', color: 'white'}}>
                            Finalize and Create Event
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Polls;