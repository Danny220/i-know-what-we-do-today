import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import apiClient from "../clients/apiClient.js";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import Label from "./ui/Label.jsx";
import usePollStore from "../stores/pollStore.js";

function CreatePoll({ groupId }) {
    const createPoll = usePollStore(state => state.createPoll);
    const [title, setTitle] = useState('');
    const [timeOptions, setTimeOptions] = useState('');
    const [locationOptions, setLocationOptions] = useState('');
    const [activityOptions, setActivityOptions] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pollData = {
            title,
            timeOptions: timeOptions.split(',').map(s => s.trim()).filter(s => s),
            locationOptions: locationOptions.split(',').map(s => s.trim()).filter(s => s),
            activityOptions: activityOptions.split(',').map(s => s.trim()).filter(s => s),
        };

        try {
            await createPoll(groupId, pollData);
            alert('Poll created successfully!');
            // Clear the form
            setTitle('');
            setTimeOptions('');
            setLocationOptions('');
            setActivityOptions('');
        } catch (error) {
            console.error('Error creating poll', error);
            alert('Error: ' + (error.response?.data?.message || 'Please try again.'));
        }
    };

    return (
        <Card>
            <H2>Propose a New Event</H2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="title">Poll Title</Label>
                    <Input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Weekend Outing" required />
                </div>
                <div>
                    <Label htmlFor="time">Time Options (YYYY-MM-DD HH:mm, comma-separated)</Label>
                    <Input id="time" type="text" value={timeOptions} onChange={e => setTimeOptions(e.target.value)} placeholder="e.g., 2025-10-25 20:30, 2025-10-26 21:00" />
                </div>
                <div>
                    <Label htmlFor="location">Location Options (comma-separated)</Label>
                    <Input id="location" type="text" value={locationOptions} onChange={e => setLocationOptions(e.target.value)} placeholder="e.g., Pizzeria, Sushi Restaurant" />
                </div>
                <div>
                    <Label htmlFor="activity">Activity Options (comma-separated)</Label>
                    <Input id="activity" type="text" value={activityOptions} onChange={e => setActivityOptions(e.target.value)} placeholder="e.g., Dinner, Aperitivo" />
                </div>
                <Button type="submit" className="w-full">Create Poll</Button>
            </form>
        </Card>
    );
}

export default CreatePoll;