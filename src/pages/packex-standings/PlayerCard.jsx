import React, { useState } from 'react';
import tournamentLegend from '../../static/packex_tourament_legend.json';
console.log('rouanemtn legned', tournamentLegend);

const tournamentsById = {};
Object.keys(tournamentLegend.data).forEach(tId => tournamentsById[tournamentLegend.data[tId].match_id] = tournamentLegend.data[tId].label);

const PlayerCard = (props) => {
  const { playerId, name, scores, rating, ratingChanges, matchKey } = props;
  const [opened, setOpened] = useState(false);

  return (
    <div
      className="player-card"
    >
      <h3
        onClick={() => setOpened(!opened)}
      >
        {name}: {rating.toFixed(3)}
      </h3>
      {opened && (
        <div
          className="player-card__data"
        >
          <PlayerData
            playerId={playerId}
            scores={scores}
            ratingChanges={ratingChanges}
            matchKey={matchKey}
          />
        </div>
      )}
    </div>
  );
};

const PlayerData = (props) => {
  const { scores, ratingChanges, matchKey, playerId } = props;
  console.log('tournaments by id', tournamentsById);
  return (
    <table>
      <thead>
        <tr>
          <th>Tournament name</th>
          <th>Score</th>
          <th>Rating Change</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score, index) => {
          return (
            <tr
              key={`player-${playerId}-${index}`}
            >
              <td>{tournamentsById[matchKey[index]]}</td>
              <td>{score}</td>
              <td>{ratingChanges[index].toFixed(3)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PlayerCard;
