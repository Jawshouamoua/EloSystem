const eloFunction = require('./eloSystem')
const prompt = require('prompt-sync')()
const os = require('os')
const csv = require('fast-csv')
const fs = require('fs')
const { resolve, parse } = require('path')
const path = require('path')
const { getRandomValues } = require('crypto')

const [GameClass, eloModData] = require('./classes/GameClass')
const PlayerClass = require('./classes/PlayerClass')

function createCSVFileReadPromise(filePath){
    let promise = new Promise(function(resolve, reject){
        const data = []
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {reject(error)})
            .on('data', row => data.push(row))
            .on('end', () => resolve(data))
    })
    return promise
}

function player(name, rating, k, score){
    this.name = name
    this.rating = parseFloat(rating)
    this.k = parseFloat(k)
    this.score = parseFloat(score)
}

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

let count = 0

function comparePlayersToAllPlayers(players){
    // loop through all players

    let updatedPlayerList = []
    for(let i=0;i<players.length;i++){
        players.forEach((element, index, array)=>{
            if(index == i){
                return
            } 
            let outcome = getPlayerAOutcome(players[i], element)
            pointsEarned = eloFunction(
                players[i].rating, 
                element.rating, 
                players[i].kValue,
                outcome
            )
            updatedPlayerList.push(new player(
                    players[i].name,
                    players[i].rating,
                    players[i].kValue
                )
            )
            console.log(
                players[i].name,
                players[i].rating,
                element.name,
                element.rating,
                `    Points earned by ${players[i].name}: ${pointsEarned.toFixed(2)}`
            )
            count++
        })
    }
    console.log(`Number of Comparisons: ${count}`)
    count = 0
    return [updatedPlayerList, players]
}


function isCSVFile(file){
    const csvPattern = /(\.csv)$/g
    if(file.match(csvPattern)){return true}
    return false
}

function getCSVFilesFromDirectory(pathLocation){
    return  new Promise((resolve, reject)=>{
        fs.readdir(path.resolve(__dirname + '/csv_folder'), (err, files)=>{
            let result = files.map((elem, index, array) =>{
                if (isCSVFile(elem)){ return path.resolve('./csv_folder/' + elem)}
            })
            resolve(result)
        })
    })
} 

function changeStringNumberPropertiesToFloat(data){
    data.rating = parseFloat(data.rating)
    data.kValue = parseFloat(data.kValue)
    data.score = parseFloat(data.score)
    return data
}

const pattern = /(\\|\/\/)([A-Za-z1-9\s-_])+\.csv/g
const pattern1 = /([A-Za-z1-9\s])+.csv/g
function getFileNameStringFromPath(path){
    let res1 = path.match(pattern)
    //console.log(res1)
    let res2 = res1[0].match(pattern1)
    if(res2.length > 1){ console.error("Regex pattern matching should return only 1 match") }
    return res2[0]
}

async function getDataFromCSVFiles(CSVfiles){
    let data = []
    for(let i=0;i<CSVfiles.length;i++){
        let fileName = getFileNameStringFromPath(CSVfiles[i])
        let rawData = await createCSVFileReadPromise(CSVfiles[i])
        rawData.map(changeStringNumberPropertiesToFloat)
        data.push(new GameClass(rawData, fileName))
    }
    return data
}

/*
async function consoleProgram(){
    // get count of how many csv files to read
    let fileList = await getCSVFilesFromDirectory(__dirname + '/csv_folder')

    let data = await getDataFromCSVFiles(fileList)
    
    console.log("\n")
    console.log("Running simulation...............")
    console.log("")
    console.log(`Format [NameA EloA NameB EloB PointsEarnedByA]`)
    console.log("")
    setTimeout(()=>{}, 500)

    let playerDataHistory = []
    fileList.forEach((elem, index, arr)=>{
        console.log("Running Elo Algorithm on file: " + elem)
        playerDataHistory.push(data[index])
        let updatedPlayerList = comparePlayersToAllPlayers(players = data[index])
        console.log('\n')
    })
}
*/

function merge_LocalPlayerDataWithGlobalPlayerData(localPlayerData, globalData){
    if(!globalData){ return localPlayerData }
    //merge by player name
    localPlayerData.forEach((localElem)=>{
        let globalElem = globalData.find((elem)=>{
            //console.log(elem.name, localElem.name)
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

function getPlayerDataForAllPlayers(listOfGameData, globalPlayerList){
    listOfGameData.forEach((gameData, index, arr)=>{
        let localPlayersData = []
        let playerNameList = gameData.getListOfPlayers()
        playerNameList.forEach((elem)=>{
            let playerData = gameData.getPlayerDataByName(elem)
            let player = new PlayerClass(playerData.name, playerData.rating)
            let [pts, compareData] = gameData.getResultForPlayerByName(elem)
            player.setComparisonData(compareData)             
            localPlayersData.push(player)
        })
        merge_LocalPlayerDataWithGlobalPlayerData(localPlayersData, globalPlayerList)
    })
    return globalPlayerList
}

async function consoleProgram1(){
    // GameClass handles the elo calculation for each player of a particular game
    // PlayerClass gets the elo data from GameClass
    let fileList = await getCSVFilesFromDirectory(__dirname + '/csv_folder')
    let listOfGameData = await getDataFromCSVFiles(fileList)

    let globalPlayerList = []
    globalPlayerList = getPlayerDataForAllPlayers(listOfGameData, globalPlayerList)
    // display global player list
    globalPlayerList.forEach((elem, i, arr)=>{
        elem.displayPlayerData()
    })
    // allow for user to inspect global player list
    while(true){
        console.log('\n')
        console.log('Press enter to exit program')
        let playerName = prompt("Type the name of the Player whose comparison history you would like to inspect: ")
        if(playerName == ''){
            console.log('Exiting Program') 
            break 
        }
        let result = globalPlayerList.find((elem)=> playerName == elem.name)
        if (!result){ 
            console.log(`ERROR: could not find player with name '${playerName}'`)
            continue 
        }
        console.log()
        console.log("Comparison data ---------------------------------------------------------")
        result.displayComparisonData()
    }
}

//main
consoleProgram1()
//consoleProgram()

