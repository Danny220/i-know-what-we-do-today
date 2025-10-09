import React, { useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";

function CreatePoll() {
   const {groupId} = useParams();
   const [title, setTitle] = useState('');
   const [timeOptions, setTimeOptions] = useState('');
   const [locationOptions, setLocationOptions] = useState('');
   const [activityOptions, setActivityOptions] = useState('');

   const handleSubmit = async (e) => {
       e.preventDefault();

       const pollData = {
           title,
           timeOptions: timeOptions.split(',').map(s => s.trim()),
           locationOptions: locationOptions.split(',').map(s => s.trim()),
           activityOptions: activityOptions.split(',').map(s => s.trim()),
       };

       try {
           const token = localStorage.getItem('token');
           if (!token || !groupId) {
               alert("Please enter a valid group or log in");
               return;
           }
           const config = {headers: {'Authorization': `Bearer ${token}`}};

           await axios.post(`http://localhost:3001/api/groups/${groupId}/polls`, pollData, config)

           alert("Poll created successfully!");
       } catch (err) {
           console.error("Error creating poll", err);
           alert('Error: ' + (err.response?.data?.message ?? 'Retry later.'))
       }
   };

   return (
       <div>
           <hr style={{margin: '20px 0'}}/>
           <h2>Suggest a New Event</h2>
           <form onSubmit={handleSubmit}>
               <div>
                   <label>Poll Title:</label>
                   <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Weekend out?" required />
               </div>
               <div>
                   <label>Time Options (format AAAA-MM-GG HH:mm, comma separated):</label>
                   <input
                       type="text"
                       value={timeOptions}
                       onChange={e => setTimeOptions(e.target.value)}
                       placeholder="Ex.: 2025-10-25 20:30, 2025-10-26 21:00"
                   />
               </div>
               <div>
                   <label>Location Options (comma-separated):</label>
                   <input type="text" value={locationOptions} onChange={e => setLocationOptions(e.target.value)} placeholder="Pizzeria, club, bar, home"/>
               </div>
               <div>
                   <label>Activity Options (comma-separated):</label>
                   <input type="text" value={activityOptions} onChange={e => setActivityOptions(e.target.value)} placeholder="Drinking, eating, visiting"/>
               </div>
               <button type="submit">Create Poll</button>
           </form>
       </div>
   );
}

export default CreatePoll;