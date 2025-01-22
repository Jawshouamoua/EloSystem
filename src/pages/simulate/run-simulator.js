import getPointsEarned from '../../elo-system';
import { rd1, rd2, rd3 } from '../../static/ssc';

const ROUNDS = [rd1, rd2, rd3];
const runSimulator = (payload) => {
  const { numberOfRounds, numberOfPlayers, basePoints, kValue } = payload;

  if (numberOfRounds > ROUNDS.length) throw new Error('Not enough rounds to simulate data');

  let results = {};
  ROUNDS.slice(0, numberOfRounds).forEach(round => {
    const _round = round.slice(0, numberOfPlayers);
    try {
      const newResults = calculateRound(_round, results, basePoints, kValue);
      results = newResults;
    } catch (error) {
      throw error;
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
    const { id, name, score } = player;
    if (!playersByKey.hasOwnProperty(id)) {
      playersByKey[id] = { name, scores: [score], rating: basePoints, ratingChanges: [] };
    } else {
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

export default runSimulator;
