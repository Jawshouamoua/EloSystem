// value between 1 and 0
// 1 = player A wins, 0.5 = player A tie, 0 = player A loses
function calc_modifier_basedOnOutcome(score){
    // value between 1 and 0
    return score
}

function calc_modifier_probabilityOfWinning_basedOnEloDifference(elo_PlayerA, elo_PlayerB){
    const CONSTANT = 400 // player with 400 point advantage is 10 times more likely to win than lose
    // If playerA has 400 point advantage it will make value become approx 0.909 
    return 1/(1 + Math.pow(10, (elo_PlayerB - elo_PlayerA)/CONSTANT)) // see docs for what function looks like
}

function calc_EloChangeForPlayerA(elo_PlayerA, elo_PlayerB, K, outcome){
    if(outcome < 0 || outcome > 1){
        console.error("outcome value should be in range [0,1]")
        return
    }
    
    //const K = 30 // constant used to determine max amount of points player A can earn
    const expectedScore = calc_modifier_probabilityOfWinning_basedOnEloDifference(elo_PlayerA, elo_PlayerB)

    // outcome is in range [0,1] and expected score in range [0,1]
    
    const playerA_pointsEarned = K * (outcome - expectedScore)
    return playerA_pointsEarned 
}

module.exports = calc_EloChangeForPlayerA