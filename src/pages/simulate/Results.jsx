import React from 'react';

const Results = ({ data }) => {
  const idList = Object.keys(data);

  const { scores } = data[idList[0]];

  const numberOfRounds = scores.length;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          {Array.from({ length: numberOfRounds }, (_, i) => (
            <th key={`header-round-${i}`}>Round {i + 1}</th>
          ))}
          <th>Old rating</th>
          <th>New rating</th>
          <th>Rating change</th>
          <th>Breakdown</th>
        </tr>
      </thead>
      <tbody>
        {idList.map(id => (
          <PlayerRow
            key={`player-row-${id}`}
            player={{ id, ...data[id] }}
          />
        ))}
      </tbody>
    </table>
  );
};

const PlayerRow = ({ player }) => {
  const {
    id,
    name,
    scores,
    rating,
    ratingChanges
  } = player;

  const ratingChange = ratingChanges.reduce((prev, rating) => prev + rating, 0);
  const oldRating = rating - ratingChange;

  return (
    <tr
      key={`$player-row-inner-${id}`}
    >
      <td>{id}</td>
      <td>{name}</td>
      {scores.map(score => {
        return <td>{score}</td>
      })}
      <td>{oldRating.toFixed(3)}</td>
      <td>{rating.toFixed(3)}</td>
      <td>{ratingChange.toFixed(3)}</td>
      <td>
        {ratingChanges.map(change => <>{change.toFixed(3)}, </>)}
      </td>
    </tr>
  );
};

export default Results;
