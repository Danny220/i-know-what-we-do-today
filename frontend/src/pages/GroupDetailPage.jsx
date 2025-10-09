import React from 'react';
import { useParams } from 'react-router-dom';
import Polls from '../components/Polls';
import EventList from '../components/EventList';
import CreatePoll from '../components/CreatePoll';

function GroupDetailPage() {
    const { groupId } = useParams();

    return (
        <div>
            <h2>Group Details: {groupId}</h2>
            <EventList groupId={groupId} />
            <Polls groupId={groupId} />
            <CreatePoll groupId={groupId} />
        </div>
    )
}

export default GroupDetailPage;