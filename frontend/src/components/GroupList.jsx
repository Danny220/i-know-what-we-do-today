import React, {useEffect } from "react";
import {Link} from "react-router-dom";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import useGroupStore from "../stores/groupStore.js";

function GroupList() {
    // Use store
    const { groups, isLoading, fetchGroups } = useGroupStore();

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    if (isLoading) {
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