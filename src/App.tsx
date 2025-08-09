import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Landing, Login, Discover } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/discover" element={<Discover />} />
    </Routes>
  );
}

export default App;
