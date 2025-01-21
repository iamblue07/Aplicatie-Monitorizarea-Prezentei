import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OrganizerMenu from './pages/OrganizerMenu';
import ParticipantMenu from './pages/ParticipantMenu';
import GroupDetailsComponent from './components/GroupDetailsComponent';
import EventComponent from './components/EventComponent';
import CreateGroupComponent from './components/CreateGroupComponent';
import EventDetailsComponent from './components/EventDetailsComponent';
import CreateEventComponent from './components/CreateEventComponent';

function App() {
  console.log("Routes are being set up!");
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/organizer" element={<OrganizerMenu />} />
        <Route path="/participant" element={<ParticipantMenu />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/group/:id_group" element={<GroupDetailsComponent />}/>
        <Route path="/group/:id_group/:id_event" element={<EventComponent/>}/>
        <Route path="/create-group" element={<CreateGroupComponent/>}/>
        <Route path="/events/:id_event" element={<EventDetailsComponent/>}/>
        <Route path="/:id_group/create-event" element={<CreateEventComponent/>}/>
      </Routes>
    </Router>
  );
}

export default App;

