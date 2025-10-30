import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGroupDetailStore from "../stores/groupDetailStore.js";
import useMemberStore from "../stores/memberStore.js";
import { jwtDecode } from "jwt-decode";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";
import H2 from "./ui/H2.jsx";
import Label from "./ui/Label.jsx";
import toast from "react-hot-toast";
import ConfirmationModal from "./ui/ConfirmationModal.jsx";

function GroupSettings({ group }) {
  const { updateGroup, deleteGroup } = useGroupDetailStore();
  const { members } = useMemberStore();
  const navigate = useNavigate();

  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token).user : null;
  const currentUserIsAdmin =
    members.find((m) => m.id === currentUser?.id)?.role === "admin";

  if (!currentUserIsAdmin) {
    return;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updateGroupToast = toast.loading("Updating group...");

    try {
      await updateGroup(group.id, { name, description });
      toast.success("Group updated successfully!", { id: updateGroupToast });
    } catch {
      toast.error("Failed to update group.", { id: updateGroupToast });
    }
  };

  const handleDeleteClick = () => setIsModalOpen(true);
  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    const deleteGroupToast = toast.loading("Deleting group...");

    try {
      await deleteGroup(group.id);
      toast.success("Group deleted successfully!", { id: deleteGroupToast });
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete group.", { id: deleteGroupToast });
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <H2>⚙️ Group Settings</H2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label>Group Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>

        <div className="mt-8 pt-4 border-t border-red-500/30">
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
          <p className="text-sm text-gray-400 mt-1 mb-3">
            Deleting a group is a permanent action.
          </p>
          <Button
            onClick={handleDeleteClick}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete this Group
          </Button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Group"
        message={`Are you sure you want to permanently delete "${group.name}"? This action cannot be undone.`}
      />
    </>
  );
}

export default GroupSettings;
