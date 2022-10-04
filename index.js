const eloFunction = require('./eloSystem')
const prompt = require('prompt-sync')()
const os = require('os')
const csv = require('fast-csv')
const fs = require('fs')
const { resolve, parse } = require('path')
const path = require('path')
const { getRandomValues } = require('crypto')

const GameClass = require('./classes/GameClass')

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

async function getDataFromCSVFiles(CSVfiles){
    let data = []
    for(let i=0;i<CSVfiles.length;i++){
        let rawData = await createCSVFileReadPromise(CSVfiles[i])
        rawData.map(changeStringNumberPropertiesToFloat)
        data.push(new GameClass(rawData))
    }
    return data
}

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

async function consoleProgram1(){
    /* 
        - go through file by file (game by game) and run elo algorithm for all
        players in that game
        - Keep global track of each player + their rating score + ranking + K value
            - global tracker should have info for all players that are found
            in csv files
    
    */

    let fileList = await getCSVFilesFromDirectory(__dirname + '/csv_folder')
    let listOfGameData = await getDataFromCSVFiles(fileList)
    listOfGameData.forEach((elem, index, arr)=>{
        let [r, r1] = elem.getResultForPlayerByName("carl") 
        console.log(r, r1)
    })

    // for each player in game, calculate result for that player and then put in global player tracker

    
}
/* 
- randomly generate array of players with random elo, then compare each player to each player 
to get elo lossed or gained
- outcome: 
    - 1 = assume all comparisions are wins, 
    - 0.5 = assume all comparisons are ties, 
    - 0 = assume all comparisons are losses 
*/

consoleProgram1()
//consoleProgram()

