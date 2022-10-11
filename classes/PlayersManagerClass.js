const lodash = require('../node_modules/lodash')
const PlayerClass = require('./PlayerClass')
const [eloFunction, kmodFunction] = require('../eloSystem')


const startingRating = 1200
const startingKValue = 40

function splitNameStringBySpace(string){
    if(typeof(string) != 'string'){
        console.log('Error should be type string')
        throw new TypeError('value should be a string')
    }
    let res = string.split(' ')
    if(res.length < 2){
        throw "could find last name in string"
    }
    return res
}

class PlayersManagerClass {
    playerMap = new Map()

    constructor(){

    }

    addPlayer(player){
        this.playerMap.set(player.getPlayerName, player)
    }

    getPlayerByName(playerName){
        let player = this.playerMap.get(playerName)
        if(!player){ console.error(`Player of ${playerName} could not be found`) }
        return player
    }

    getPlayerByLastName(playerLastName){
        let keys = this.playerMap.keys()
        console.log(keys)
        let result = ''
        let stringMatchCount = 0
        for(const nameKey of keys){
            let lastName = splitNameStringBySpace(nameKey)
            if(  lastName[lastName.length - 1] == playerLastName.toUpperCase()){ 
                if(stringMatchCount > 1){
                    continue
                }
                result = nameKey
                stringMatchCount++
            }
        }
        
        if(result){
            let multipleMatchWarning = false
            if(stringMatchCount > 1){ multipleMatchWarning = true }
            return [this.playerMap.get(result), multipleMatchWarning]
        }
        return false
    }

    initPlayerListFromGameDataArray(listOfGames){
        listOfGames.forEach((game, index, arr)=>{
            game.getGameData().forEach((gameData)=>{
                let result = this.playerMap.get(gameData.name)
                if(!result){ this.playerMap.set(gameData.name, new PlayerClass(gameData.name, startingRating, startingKValue)) }
            })
        })
    }

    generateComparisonDataForEachPlayer(gamesManager){
        gamesManager.getGamesList().forEach((game)=>{
            let listOfPlayerNamesInThisGame = game.getListOfPlayerNames()
            listOfPlayerNamesInThisGame.forEach((playerName)=>{
                let player = this.playerMap.get(playerName)
                let [pointsEarned, comparisonData] = game.getResultForPlayer(player, this.playerMap)
                player.mergPlayerComparisonData(comparisonData)
            })
        })
    }


    merge_LocalPlayerDataWithGlobalPlayerData(localPlayerData, globalData){
        if(!globalData){ return localPlayerData }
        //merge by player name
        localPlayerData.forEach((localElem)=>{
            let globalElem = globalData.find((elem)=>{
                return elem.name == localElem.name 
            })
            if (globalElem){ 
                globalElem.mergPlayerComparisonData(localElem)
                return
            }
            else { globalData.push(localElem) }
        })
        return globalData
    }
    
}

module.exports = PlayersManagerClass