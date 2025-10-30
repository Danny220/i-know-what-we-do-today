import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import useProfileStore from "../stores/profileStore.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import H1 from "../components/ui/H1.jsx";
import H2 from "../components/ui/H2.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import toast from "react-hot-toast";

function ProfilePage() {
    const {userId} = useParams();
    const {profile, isLoading, fetchProfile, updateProfile} = useProfileStore();
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');

    const token = localStorage.getItem('token');
    const currentUser = token ? jwtDecode(token).user : null;
    const isOwnProfile = currentUser?.id === userId;

    useEffect(() => {
        fetchProfile(userId).then();
    }, [userId, fetchProfile]);

    useEffect(() => {
        if (profile) {
            setBio(profile.bio || '');
        }
    }, [profile]);

    const handleSave = async () => {
        const saveProfileToast = toast.loading('Updating profile...');

        try {
            await updateProfile({bio});
            setIsEditing(false);
            toast.success('Profile updated successfully!', {id: saveProfileToast});
        } catch {
            toast.error('Failed to update profile. Please try again.', {id: saveProfileToast});
        }
    };
    const renderPage = () => {
        if (isLoading) return <p>Loading profile...</p>
        if (!profile) return <p className="text-red-400">Profile not found.</p>

        return (
            <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
                <H1>{profile.username}</H1>
                <div className="mt-4">
                    <H2>Biography</H2>
                    {isEditing ? (
                        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="4"></Textarea>
                    ) : (
                        <p className="text-gray-400 mt-1">{bio || 'This user has not written a bio yet.'}</p>
                    ) }
                </div>
                {isOwnProfile && (
                    <div className="mt-6">
                        {isEditing ? (
                            <div className="flex gap-4">
                                <Button onClick={handleSave}>Save</Button>
                                <Button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700">Cancel</Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Container>
            {renderPage()}
        </Container>
    )
}

export default ProfilePage;