import React from 'react';

const ratingSort = (a, b) => {
  return b.rating - a.rating;
};

const Results = ({ data, sort = 'rank' }) => {
  let idList = Object.keys(data);


  if (sort === 'rating') {
    idList.sort((a, b) => ratingSort(data[a], data[b]));
  }

  const { scores } = data[idList[0]];

  const numberOfRounds = scores.length;

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          {Array.from({ length: numberOfRounds }, (_, i) => (
            <th key={`header-round-${i}`}>Round {i + 1}</th>
          ))}
          <th>Total Strokes</th>
          <th>Old rating</th>
          <th>New rating</th>
          <th>Rating change</th>
          <th>Breakdown</th>
        </tr>
      </thead>
      <tbody>
        {idList.map((id, index) => (
          <PlayerRow
            key={`player-row-${id}`}
            player={{ id, rank: index, ...data[id] }}
          />
        ))}
      </tbody>
    </table>
  );
};

const PlayerRow = ({ player }) => {
  const {
    id,
    rank,
    name,
    scores,
    rating,
    ratingChanges
  } = player;

  const ratingChange = ratingChanges.reduce((prev, rating) => prev + rating, 0);
  const oldRating = rating - ratingChange;
  const total = scores.reduce((prev, score) => prev + score, 0);

  return (
    <tr
      key={`$player-row-inner-${id}`}
    >
      <td>{rank + 1}</td>
      <td>{name}</td>
      {scores.map(score => {
        return <td>{score}</td>
      })}
      <td>{total}</td>
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
