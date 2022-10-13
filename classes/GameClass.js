const { CsvParserStream } = require('fast-csv')
const [eloFunction, kmodFunction] = require('../eloSystem')
const dayjs = require('dayjs')
let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const customDateFormat = 'MM/DD/YYYY H:mm:ss a'

function eloModData(name, rating, outcome, pointsEarned){
    this.name = name
    this.rating = rating
    this.outcome = outcome
    this.pointsEarned = pointsEarned
}

function dataInterface(rawGameData){
    this.name = rawGameData.Name.toUpperCase()
    this.score = parseFloat(rawGameData.Score)
}


function formatRawGameData(rawGameData, index, array){
    array[index] = new dataInterface(rawGameData)
}

function checkDateAndTimeFormat(date, time){
    let datePattern = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g
    let timePattern = /[0-9]{2}:[0-9]{2} (pm|am)/g
    let dateMatches = date.match(datePattern)
    let timeMatches = time.match(timePattern)

    if(!dateMatches || !timeMatches){
        console.error(`error in date and time format in csv file: 
        Expected:"MM/DD/YYYY" found ${date}  
        Expected "00:00 am/pm" found ${time}`)
        process.exit(1)
    }
}

class GameClass {
    gameData = []
    constructor(gameData, gameName){
        /*
        // Why does this make this.gameData undefined?
        this.gameData = gameData.forEach(formatRawGameData)
        console.log(this.gameData)
        */

       let cleanedGameData = []
       let dateAndTime 
        gameData.forEach((rawGameData, index, arr)=>{
            if(rawGameData.Name) { 
                cleanedGameData.push(new dataInterface(rawGameData)) 
            }
            else if(rawGameData.Time && rawGameData.Date){
                checkDateAndTimeFormat(rawGameData.Date, rawGameData.Time)
                let string = rawGameData.Date + ' ' + rawGameData.Time
                dateAndTime = dayjs(string).format(customDateFormat)
            }
        })

        this.gameData = cleanedGameData
        this.gameName = gameName
        this.dateAndTime = dayjs(dateAndTime)
    }

    getDateAndTimeOfGame(){
        return this.dateAndTime
    }

    getListOfPlayerNames(){
        let listOfPlayers = []
        this.gameData.forEach((data, index, array)=>{
            if(data.name == undefined){ console.error("name property cannot be undefined") }
            listOfPlayers.push(data.name)
        })
        return listOfPlayers
    }

    isPlayerInGame(player){
        let result = this.gameData.find((data)=>{
            return data.name == player.getPlayerName()
        })
        if(result){return true}
        return false
    }

    getResultForPlayer(player, mapOfPlayers){ // where left off
        let comparisonData = []
        let totalPointsEarned = 0

        this.gameData.forEach((data, index, array)=>{
            if(data.name == player.getPlayerName()){ return }
            let playerB = mapOfPlayers.get(data.name)

            let outcome = this.getPlayerAOutcome(player.getPlayerName(), playerB.getPlayerName())
            let pointsEarned = eloFunction(
                player.getPlayerRating(), 
                playerB.getPlayerRating(), 
                player.getPlayerKValue(),
                outcome
            )
            totalPointsEarned += pointsEarned
            comparisonData.push(new eloModData(
                playerB.getPlayerName(), 
                playerB.getPlayerRating(),
                outcome,
                pointsEarned
                )
            )
        })
        comparisonData.gameName = this.gameName
        comparisonData.kValueMod = kmodFunction(player, this.gameData) 
        return [totalPointsEarned, comparisonData]
    }

    getGameData(){
        return this.gameData
    }

    getGameName(){
        return this.gameName
    }

    getPlayerDataByName(playerName){
        return this.gameData.find((data) => data.name == playerName)
    }

    getPlayerAOutcome(targ_playerA_name, playerB_name){
        const playerAScore = this.getPlayerDataByName(targ_playerA_name).score
        const playerBScore = this.getPlayerDataByName(playerB_name).score

        let outcome = 0.0
        if(playerAScore > playerBScore){
            outcome = 0
        }
        else if(playerAScore == playerBScore){
            outcome = 0.5
        } 
        else if(playerAScore < playerBScore){
            outcome = 1
        }
        else{
            console.error("playerB param should be a player object with a 'score' property")
        }
        return outcome
    }
}



module.exports = [GameClass, eloModData]