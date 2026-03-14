import React, { useState } from "react";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import Input from "./ui/Input.jsx";
import Textarea from "./ui/Textarea.jsx";
import Button from "./ui/Button.jsx";
import toast from "react-hot-toast";
import Label from "./ui/Label.jsx";
import { useCreateGroup } from "../hooks/useGroups.js";

function CreateGroup() {
  const [groupData, setGroupData] = useState({ name: "", description: "" });
  const { mutateAsync: createGroup, isPending } = useCreateGroup();

  const handleChange = (e) => {
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const creationToast = toast.loading("Creating group...");

    try {
      await createGroup(groupData);

      toast.success(`Group "${groupData.name}" created!`, {
        id: creationToast,
      });

      setGroupData({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating group", error);

      toast.error("Failed to create group.", { id: creationToast });
    }
  };

  return (
    <Card className="space-y-6">
      <H2>Create a new group</H2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="groupName">Group Name:</Label>
          <Input
            id="groupName"
            type="text"
            name="name"
            value={groupData.name}
            onChange={handleChange}
            disabled={isPending}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description:</Label>
          <Textarea
            id="description"
            name="description"
            value={groupData.description}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Group"}
        </Button>
      </form>
    </Card>
  );
}

export default CreateGroup;
