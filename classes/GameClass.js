const eloFunction = require('../eloSystem')

function eloModData(name, rating, outcome, pointsEarned){
    this.name = name
    this.rating = rating
    this.outcome = outcome
    this.pointsEarned = pointsEarned
}

class GameClass {
    gameData = []
    constructor(gameData, gameName){
        this.gameData = gameData
        this.gameName = gameName  
    }

    getListOfPlayers(){
        let listOfPlayers = []
        this.gameData.forEach((elem, index, array)=>{
            if(elem.name == undefined){ console.error("name property cannot be undefined") }
            listOfPlayers.push(elem.name)
        })
        return listOfPlayers
    }

    getResultForPlayerByName(playerName){
        const player = this.getPlayerDataByName(playerName)
        let comparisonData = []
        let totalPointsEarned = 0

        this.gameData.forEach((element, index, array)=>{
            if(element.name == player.name){
                return
            } 
            let outcome = getPlayerAOutcome(player, element)
            let pointsEarned = eloFunction(
                player.rating, 
                element.rating, 
                player.kValue,
                outcome
            )
            totalPointsEarned += pointsEarned
            comparisonData.push(new eloModData(
                element.name, 
                element.rating,
                outcome,
                pointsEarned
                )
            )
        })
        comparisonData.gameName = this.gameName
        return [totalPointsEarned, comparisonData] 
    }

    getGameData(){
        return this.gameData
    }

    getPlayerDataByName(playerName){
        return this.gameData.find((element) => element.name == playerName)
    }
}

function getPlayerAOutcome(targ_playerA, playerB){
    let outcome = 0.0
    if(targ_playerA.score > playerB.score){
        outcome = 0
    }
    else if(targ_playerA.score == playerB.score){
        outcome = 0.5
    } 
    else if(targ_playerA.score < playerB.score){
        outcome = 1
    }
    else{
        console.error("playerB param should be a player object with a 'score' property")
    }
    return outcome
}

module.exports = [GameClass, eloModData]