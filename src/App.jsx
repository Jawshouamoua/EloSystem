import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Simulator from './pages/simulate';
import PackexStandings from './pages/packex-standings';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Simulator />} />
        <Route path="/simulate" element={<Simulator />} />
        <Route path="/packexcup-ratings" element={<PackexStandings />} />
      </Routes>
    </>
  );
};

export default App;
