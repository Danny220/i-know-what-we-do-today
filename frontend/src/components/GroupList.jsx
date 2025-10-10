import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import apiClient from "../clients/apiClient.js";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";

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

                const response = await apiClient.get('/groups');

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
        return <p className="text-gray-400">Loading groups...</p>;
    }

    return (
        <Card>
            <H2>My groups</H2>
            {groups.length === 0 ? (
                <p className="text-gray-400">You are not part of any group yet.</p>
            ) : (
                <div className="space-y-4">
                    {groups.map(group => (
                        <Link key={group.id} to={`/groups/${group.id}`} className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                            <h3 className="font-bold text-lg text-white">{group.name}</h3>
                            <p className="text-sm text-gray-300">{group.description}</p>
                        </Link>
                    ))}
                </div>
            )}
        </Card>
    );
}

export default GroupList;