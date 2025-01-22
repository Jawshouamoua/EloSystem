import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Simulator from './pages/simulate';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Simulator />} />
        <Route path="/simulate" element={<Simulator />} />
      </Routes>
    </>
  );
};

export default App;
