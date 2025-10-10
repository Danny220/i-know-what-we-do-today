import React from 'react';
import GroupList from '../components/GroupList';
import CreateGroup from '../components/CreateGroup';
import Container from "../components/ui/Container.jsx";

function DashboardPage() {
    return (
        <Container>
            <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="md:col-span-2">
                    <GroupList />
                </div>

                <div>
                    <CreateGroup />
                </div>
            </div>
        </Container>
    );
}

export default DashboardPage;