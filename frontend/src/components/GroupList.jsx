import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const response = await axios.get('http://localhost:3001/api/groups', config);

                setGroups(response.data);
            } catch (err) {
                console.error('Error fetching groups',err)
            } finally {
                setLoading(false);
            }
        };

        fetchGroups().then(() => {});
    }, []);

    if (loading) {
        return <p>Loading groups...</p>;
    }

    return (
        <div>
            <hr style={{margin: '20px 0'}}/>
            <h2>My groups</h2>
            {groups.length === 0 ? (
                <p>You are still not member of any group</p>
            ) : (
                <ul>
                    {groups.map(group => (
                        <li key={group.id}><Link to={`/groups/${group.id}`} style={{color: '#61dafb'}}>{group.name}</Link></li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GroupList;