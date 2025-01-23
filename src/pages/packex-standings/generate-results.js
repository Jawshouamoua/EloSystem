import getPointsEarned from "../../elo-system";

export const generateResults = (data) => {
  const basePoints = 1200;
  const kValue = 32;
  const roundKeys = Object.keys(data);
  let results = {};
  console.log('round keys', roundKeys);
  console.log('round 1', data[roundKeys[0]]);
  roundKeys.forEach(roundKey => {
    const round = data[roundKey];
    try {
      const newResults = calculateRound(round, results, basePoints, kValue);
      results = newResults;
    } catch (err) {
      throw err;
    }
  });

  return results;
};


const calculateRound = (round, playerDb = {}, basePoints, kValue) => {
  const playersByKey = { ...playerDb };
  const pointChangesStorage = {};

  // Create a new player object if it doesn't exist in the temp storage
  // or add the score to the existing player.
  round.forEach(player => {
    const { id, name, score, match_id } = player;
    if (!playersByKey.hasOwnProperty(id)) {
      playersByKey[id] = { name, scores: [score], rating: basePoints, ratingChanges: [], matchKey: [match_id] };
    } else {
      playersByKey[id]['matchKey'] = [...playersByKey[id].matchKey, match_id];
      playersByKey[id]['scores'] = [...playersByKey[id].scores, score];
    }
    pointChangesStorage[id] = 0;
  });

  for (let i = 0; i < round.length; i += 1) {
    const { id: currentId, score: currentScore } = round[i];
    if (!playersByKey.hasOwnProperty(currentId)) throw new Error('Player does not exist');
    const currentPlayer = playersByKey[currentId];

    for (let j = i + 1; j < round.length; j += 1) {
      const { id: oppId, score: oppScore } = round[j];
      if (oppId === currentId) return;
      if (!playersByKey.hasOwnProperty(oppId)) throw new Error('Player does not exist');
      const _opponent = playersByKey[oppId];

      const result = getPointsEarned({ ...currentPlayer, score: currentScore }, { ..._opponent, score: oppScore }, kValue);

      // Add result to current player and add inverse to opponent to move points from one to another.
      playersByKey[currentId].rating += result;
      pointChangesStorage[currentId] += result;
      playersByKey[oppId].rating += (-1 * result);
      pointChangesStorage[oppId] += (-1 * result);
    };
  };

  // Push the rating changes to the data.
  Object.keys(pointChangesStorage).forEach(currentId => {
    playersByKey[currentId].ratingChanges.push(pointChangesStorage[currentId]);
  });

  return playersByKey;
};