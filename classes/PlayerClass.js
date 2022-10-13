const { kebabCase } = require('lodash')
const [eloFunction, kmodFunction] = require('../eloSystem')

function playerHistoryData(gName, rating, kValue){
    //keeps track of old rating and kvalue for each game
    this.gameName = gName
    this.rating = rating
    this.kValue = kValue
}

class PlayerClass {

    constructor(name, rating, kValue){
        this.name = name
        this.rating = rating
        this.kValue = kValue
        this.comparisonData = []
        this.newRating = false

        this.initializedRating = rating
        this.initializedKValue = kValue

        this.playerHistoryMap = new Map()
        this.playerHistoryMap.set("Initial", new playerHistoryData("Initial", rating, kValue))
    }

    getPlayerName(){
        return this.name
    }

    getPlayerRating(){
        return this.rating
    }

    getPlayerKValue(){
        return this.kValue
    }

    updateKValue(kValueMod){
        this.kValue = this.kValue + kValueMod
    }

    updatePlayerUsingComparisonsFromGame(gameName){
        if(this.comparisonData.length == 0){ console.error("comparison data is empty") }

        let totalPointsEarned = 0
        let totalKValueChange = 0

        let comparisonDataForGame = this.comparisonData.find((elem)=>elem.gameName == gameName)

        if(!comparisonDataForGame){ 
            console.error(`Could not find game with name: ${gameName}`) 
            process.exit(1)
        }

        totalKValueChange += comparisonDataForGame.kValueMod
        comparisonDataForGame.forEach(data=>{
            totalPointsEarned += data.pointsEarned
        })

        this.playerHistoryMap.set(comparisonDataForGame.gameName, new playerHistoryData(comparisonDataForGame.gameName, this.rating, this.kValue))

        this.rating = this.rating + totalPointsEarned
        this.kValue = this.kValue + totalKValueChange
    }

    setComparisonData(compData){
        this.comparisonData.push(compData)
    }
    getComparisonData(){
        return this.comparisonData
    }
    displayPlayerData(){
        console.log(`Name: ${this.name}, Rating: ${this.rating}, KValue: ${this.kValue}`)
    }

    displayComparisonData(){
        if(this.comparisonData.length == 0){ console.error("comparison data is empty") }

        let totalPointsEarned = 0
        let totalKValueChange = 0
        
        console.log(`ComparisonData for ${this.name}, starting Elo: ${this.initializedRating.toFixed(2)}, starting K: ${this.initializedKValue.toFixed(2)}`)

        this.comparisonData.forEach((elem, index, arr)=>{
            let kValueModForThisGame = this.comparisonData[index].kValueMod 
            totalKValueChange += kValueModForThisGame

            let playerHistoryData = this.playerHistoryMap.get(elem.gameName)
            // if can't find old player history data for game, then the old player data for that 
            // game must be the initialized values
            if(!playerHistoryData) { playerHistoryData =  this.playerHistoryMap.get("Initial")}

            console.log()
            console.log(`Comparison Data from Game: ${elem.gameName}, current Elo: ${playerHistoryData.rating}, current KValue ${playerHistoryData.kValue}, kValueMod from this game: ${kValueModForThisGame}`)
            let totalPointsEarnedInGame = 0
            elem.forEach((objectInData, i, arr1)=>{
                totalPointsEarnedInGame += objectInData.pointsEarned
                totalPointsEarned += objectInData.pointsEarned
                console.log(`Opponent_Stats[Name:${objectInData.name}, Rating: ${objectInData.rating.toFixed(2)}], Outcome: ${objectInData.outcome}, Points_Earned: ${objectInData.pointsEarned.toFixed(2)}`)
            })
            console.log(`Total Elo Changed in this game: ${totalPointsEarnedInGame}`)
        })

        console.log()
        console.log(`Net Points Earned: ${totalPointsEarned.toFixed(2)}, New Elo for ${this.name}: ${this.rating.toFixed(2)}, Total KValue Changed: ${totalKValueChange}, New KValue: ${this.kValue}`)
    }

    displayPlayerData(){
        console.log(`Name: ${this.name}, Rating: ${this.rating}, KValue: ${this.kValue}, Comparison History: ${this.comparisonData}`)
    }

    mergPlayerComparisonData(comparisonData){
        this.comparisonData.push(comparisonData)
    }

}

module.exports = PlayerClass