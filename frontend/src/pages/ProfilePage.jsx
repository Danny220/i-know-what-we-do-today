import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import H1 from "../components/ui/H1.jsx";
import H2 from "../components/ui/H2.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import toast from "react-hot-toast";
import apiClient from "../clients/apiClient.js";
import { useDropzone } from "react-dropzone";
import { useProfile, useUpdateProfile } from "../hooks/useProfile.js";

function ProfilePage() {
  const { userId } = useParams();

  const { data: profile, isLoading, isError } = useProfile(userId);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token).user : null;
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSave = async () => {
    const saveProfileToast = toast.loading("Updating profile...");

    try {
      const profileData = { bio };
      await updateProfile({ profileData });
      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: saveProfileToast });
    } catch {
      toast.error("Failed to update profile. Please try again.", {
        id: saveProfileToast,
      });
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const uploadToast = toast.loading("Uploading image...");

      try {
        const signatureResponse = await apiClient.post("/upload/signature");
        const { signature, timestamp } = signatureResponse.data;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        const cloudinaryData = await cloudinaryResponse.json();
        const avatar_url = cloudinaryData.secure_url;

        const profileData = { bio, avatar_url };

        await updateProfile({ profileData });
        toast.success("Profile picture updated successfully!", {
          id: uploadToast,
        });
      } catch (error) {
        console.error(error);
        toast.error("Upload failed.", { id: uploadToast });
      }
    },
    [bio, updateProfile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    multiple: false,
  });

  if (isError) {
    return (
      <div className="text-center py-10 text-red-400">
        Error loading profile
      </div>
    );
  }

  const renderPage = () => {
    if (isLoading) return <p>Loading profile...</p>;
    if (!profile) return <p className="text-red-400">Profile not found.</p>;

    return (
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <img
            src={
              profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${profile.username}&background=random`
            }
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />

          {isOwnProfile && (
            <div
              {...getRootProps()}
              className={`w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? "border-blue-500 bg-gray-700" : "border-gray-600"}`}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-400">
                Drag 'n' drop a new profile picture here, or click to select a
                file.
              </p>
            </div>
          )}
        </div>

        <H1>{profile.username}</H1>
        <div className="mt-4">
          <H2>Biography</H2>
          {isEditing ? (
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
            ></Textarea>
          ) : (
            <p className="text-gray-400 mt-1">
              {bio || "This user has not written a bio yet."}
            </p>
          )}
        </div>
        {isOwnProfile && (
          <div className="mt-6">
            {isEditing ? (
              <div className="flex gap-4">
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return <Container>{renderPage()}</Container>;
}

export default ProfilePage;
