const [eloFunction, kmodFunction] = require('../eloSystem')

class PlayerClass {

    constructor(name, rating, kValue){
        this.name = name
        this.rating = rating
        this.kValue = kValue
        this.comparisonData = []
        this.newRating = false
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

    updateDataUsingComparisonData(){
        if(this.comparisonData.length == 0){ console.error("comparison data is empty") }

        let totalPointsEarned = 0
        let totalKValueChange = 0

        this.comparisonData.forEach((elem, index, arr)=>{  
            totalKValueChange += arr.kValueMod

            elem.forEach((objectInData, i, arr1)=>{
                totalPointsEarned += objectInData.pointsEarned
            })
        })
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

    displayComparisonDataAndUpdatePlayerData(){
        if(this.comparisonData.length == 0){ console.error("comparison data is empty") }

        let totalPointsEarned = 0
        let totalKValueChange = 0
        
        console.log(`ComparisonData for ${this.name}, starting Elo: ${this.rating}, starting K: ${this.kValue}`)

        this.comparisonData.forEach((elem, index, arr)=>{
            let kValueModForThisGame = this.comparisonData[index].kValueMod 
            totalKValueChange += kValueModForThisGame

            console.log()
            console.log(`Comparison Data from Game: ${elem.gameName}, kValueMod from this game: ${kValueModForThisGame}`)
            elem.forEach((objectInData, i, arr1)=>{
                totalPointsEarned += objectInData.pointsEarned
                console.log(`Opponent_Stats[Name:${objectInData.name}, Rating: ${objectInData.rating}],  Outcome: ${objectInData.outcome}, Points_Earned: ${objectInData.pointsEarned}`)
            })
        })
        this.rating = this.rating + totalPointsEarned
        this.kValue = this.kValue + totalKValueChange
        console.log()
        console.log(`Total Points Earned: ${totalPointsEarned}, New Elo for ${this.name}: ${this.rating.toFixed(2)}, Total KValue Changed: ${totalKValueChange}, New KValue: ${this.kValue}`)
    }

    displayPlayerData(){
        console.log(`Name: ${this.name}, Rating: ${this.rating}, KValue: ${this.kValue} Comparison History: ${this.comparisonData}`)
    }

    mergPlayerComparisonData(comparisonData){
        this.comparisonData.push(comparisonData)
    }

}

module.exports = PlayerClass