import React, { useState, useEffect } from 'react';

import _data from '../../static/grouped_by_match_id2.json';
import tournamentLegend from '../../static/packex_tourament_legend.json';
import { generateResults } from './generate-results';
import PlayerCard from './PlayerCard';

const ratingSort = (a, b) => {
  return b.rating - a.rating;
};

const PackexStandings = () => {
  const [data, setData] = useState(_data);
  const [results, setResults] = useState();
  const [idList, setIdList] = useState([]);

  console.log('results', results);

  useEffect(() => {
    const _results = generateResults(data)
    let _idList = Object.keys(_results);
    _idList.sort((a, b) => ratingSort(_results[a], _results[b]));
    setIdList(_idList);
    setResults(_results);
  }, []);

  return (
    <div>
      <h1>PackEx Cup Ratings - 2024</h1>
      {idList.map(id => {
        const player = results[id];
        return (
          <PlayerCard
            key={`player-card-${id}`}
            playerId={id}
            {...player}
          />
        );
      })}
    </div>
  );
};

export default PackexStandings;
