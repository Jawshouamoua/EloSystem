const eloFunction = require('./eloSystem')
const prompt = require('prompt-sync')()

// array of players
// compare each player to each player
/*
// example elo ratings: 0 - 1000
const {jStat} = require("jstat")

// mean = calculated elo
// standard deviation = player performance variance (assume variance of 100 elo points)
// 40-60
console.log("normal, median: " + jStat.normal.median(500, 100))
console.log("normal, value at 40th percentile: " + jStat.normal.inv(0.4, 500, 100))
console.log("normal, value at 60th percentile: " + jStat.normal.inv(0.6, 500, 100))
*/


function generateRandomEloInRange(min, max){
    let num = min + Math.random() * (max - min)
    return  num.toFixed(2)
}

function generateListOfPlayers(numPlayers){
    let listOfPlayers = Array.from(Array(numPlayers).keys())
    for(let i=0; i<listOfPlayers.length; i++){
        listOfPlayers[i] = generateRandomEloInRange(0, 1000)
    }
    return listOfPlayers
}

let count = 0

function comparePlayerToAllPlayers(players, outcome){
    // loop through all players
    // use map to compare selected player to all players

    for(let i=0;i<players.length;i++){
        players.forEach((element, index, array)=>{
            if(index == i){
                return
            } 
            pointsEarned = eloFunction(playerA = players[i], playerB = element, outcome)
            console.log(i, players[i], index, element, pointsEarned.toFixed(2))
            count++
        })
    }
}

function consoleProgram(){
    // get number of players
    let maxPlayers = parseInt(prompt("Max players?: "))
    let listOfPlayers = generateListOfPlayers(maxPlayers)

    while(true){
        let outcome = prompt("What outcome would you like to test? (1 for win, 0.5 for tie, 0 for loss): ")
        console.log("Running simulation...............")
        console.log("")
        console.log("playerNum", "PlayerA_Elo", "playerNum", "PlayerB_Elo", "Points_Earned_By_PlayerA ")
        setTimeout(()=>{}, 500)

        comparePlayerToAllPlayers(players = listOfPlayers, outcome = 1)
        console.log(`Number of Comparisons: ${count}`)
        count = 0
        let status = prompt("press x to exit, press any key to continue: ")
        console.log('\n')
        if(status == 'x')
        {
            break
        }
    }
     
}

/* 
- randomly generate array of players with random elo, then compare each player to each player 
to get elo lossed or gained
- outcome: 
    - 1 = assume all comparisions are wins, 
    - 0.5 = assume all comparisons are ties, 
    - 0 = assume all comparisons are losses 
*/

consoleProgram()

