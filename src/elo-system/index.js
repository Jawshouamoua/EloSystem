
const calcOutcome = (score1, score2) => {
  const _score1 = parseInt(score1);
  const _score2 = parseInt(score2);
  if (_score1 < _score2) return 1;
  if (_score1 === _score2) return 0.5;
  if (_score1 > _score2) return 0;
};

const calcExpectedScore = (rating1, rating2) => {
  // player with 400 point advantage is 10 times more likely to win than lose
  // If playerA has 400 point advantage it will make value become approx 0.909
  const CONSTANT = 400;
  return 1/(1 + Math.pow(10, (rating2 - rating1)/CONSTANT));
};

const getPointsEarned = (p1, p2, k = 16) => {
  const { score: p1Score, rating: p1Rating } = p1;
  const { score: p2Score, rating: p2Rating } = p2;

  if (!p1Score || !p2Score) throw new Error('Need score for both players');
  if (!p1Rating || !p2Rating) throw new Error('Need a rating for both players');
  
  const outcome = calcOutcome(p1Score, p2Score);
  const expectedScore = calcExpectedScore(p1Rating, p2Rating);

  const pointsEarned = k * (outcome - expectedScore);
  // console.log(`${p1.name}(${p1Rating}) expected score against ${p2.name}(${p2Rating}) is ${expectedScore}, result is ${p1Score}v${p2Score} ${outcome}. ${p1.name} rating changes by ${pointsEarned}`);
  return pointsEarned;
};

export default getPointsEarned;
