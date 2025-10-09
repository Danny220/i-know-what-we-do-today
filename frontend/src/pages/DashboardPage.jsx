import React from "react";
import GroupList from "../components/GroupList.jsx";
import CreateGroup from "../components/CreateGroup.jsx";

function DashboardPage() {
    return (
        <div>
            <GroupList />
            <CreateGroup />
        </div>
    )
}

export default DashboardPage;