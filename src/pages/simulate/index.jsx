import React, { useState } from 'react';

import SimulatorForm from './SimulatorForm';
import Results from './Results';
import runSimulator from './run-simulator';

const Simulator = () => {
  const [data, setData] = useState();
  const handleSubmit = (formValues) => {
    const results = runSimulator(formValues);
    setData(results);
  };

  return (
    <div>
      This is a simulator for ELO System.
      <SimulatorForm submit={handleSubmit} />
      {data && (
        <>
          <h3>Ranking based on score</h3>
          <Results data={data} />
          <h3>Ranking based on rating</h3>
          <Results data={data} sort={'rating'} />
        </>
      )}
    </div>
  );
};

export default Simulator;
