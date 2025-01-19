import React, { useState } from 'react';

import FormInput from '../../components/form-elements/input';

const defaultForm = {
  numberOfRounds: 3,
  numberOfPlayers: 4,
  basePoints: 1200,
  kValue: 20,
};

const SimulatorForm = ({ submit }) => {
  const [numberOfRounds, setNumberOfRounds] = useState(defaultForm.numberOfRounds);
  const [numberOfPlayers, setNumberOfPlayers] = useState(defaultForm.numberOfPlayers);
  const [basePoints, setBasePoints] = useState(defaultForm.basePoints);
  const [kValue, setKValue] = useState(defaultForm.kValue);

  return (
    <div>
      <FormInput
        id="number-of-rounds"
        name="Number of rounds"
        type="number"
        min="0"
        value={numberOfRounds}
        onChange={(e) => setNumberOfRounds(e.target.value)}
        required
      />
      <FormInput
        id="number-of-players"
        name="Number of players"
        type="number"
        min="2"
        max="17"
        value={numberOfPlayers}
        onChange={(e) => setNumberOfPlayers(e.target.value)}
        required
      />
      <FormInput
        id="base-points"
        name="Base Points"
        type="number"
        min="0"
        value={basePoints}
        onChange={(e) => setBasePoints(e.target.value)}
        required
      />
      <FormInput
        id="k-value"
        name="K Value"
        type="number"
        min="0"
        value={kValue}
        onChange={(e) => setKValue(e.target.value)}
        required
      />
      <button
        type="submit"
        onClick={() => submit({
          numberOfRounds: parseInt(numberOfRounds, 10),
          numberOfPlayers: parseInt(numberOfPlayers, 10),
          basePoints: parseInt(basePoints, 10),
          kValue: parseInt(kValue, 10),
        })}
      >
        Run simulation
      </button>
    </div>
  );
};

export default SimulatorForm;
