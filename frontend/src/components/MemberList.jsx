import React, { useEffect, useState } from "react";
import useMemberStore from "../stores/memberStore.js";
import { jwtDecode } from "jwt-decode";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import Button from "./ui/Button.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmationModal from "./ui/ConfirmationModal.jsx";

function MemberList({ groupId }) {
  const { members, isLoading, fetchMembers, removeMember } = useMemberStore();

  const [memberIdToDelete, setMemberIdToDelete] = useState(null);

  // Get current user from token
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token).user : null;

  useEffect(() => {
    fetchMembers(groupId).then();
  }, [groupId, fetchMembers]);

  const handleRemoveMemberClick = (memberId) => setMemberIdToDelete(memberId);
  const handleConfirmRemove = async () => {
    const removeMemberToast = toast.loading("Removing member...");

    try {
      await removeMember(groupId, memberIdToDelete);
      setMemberIdToDelete(null);
      toast.dismiss(removeMemberToast);
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error(err.response?.data?.message || "Failed to remove member", {
        id: removeMemberToast,
      });
    }
  };

  // Check if the current user is admin
  const currentUserIsAdmin =
    members.find((m) => m.id === currentUser?.id)?.role === "admin";

  return (
    <>
      <Card>
        <H2>👥 Group Members</H2>
        {isLoading ? (
          <p className="text-gray-400">Loading members...</p>
        ) : (
          <ul className="space-y-3">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div>
                  <Link
                    to={`/profile/${member.id}`}
                    className="font-semibold text-white hover:underline"
                  >
                    {member.username}
                  </Link>
                  {member.role === "admin" && (
                    <span className="ml-2 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                {currentUserIsAdmin && (
                  <Button
                    onClick={() => handleRemoveMemberClick(member.id)}
                    className="text-xs py-1 px-3 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmationModal
        isOpen={memberIdToDelete !== null}
        onClose={() => setMemberIdToDelete(null)}
        onConfirm={handleConfirmRemove}
        title="Remove Member"
        message="Are you sure you want to remove this member from the group?"
      />
    </>
  );
}

export default MemberList;
