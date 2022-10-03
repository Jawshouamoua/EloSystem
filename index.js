const eloFunction = require('./eloSystem')
const prompt = require('prompt-sync')()
const os = require('os')
const csv = require('fast-csv')
const fs = require('fs')
const { resolve } = require('path')
const path = require('path')
const { getRandomValues } = require('crypto')


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
    this.rating = rating
    this.k = k
    this.score = score
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

function comparePlayerToAllPlayers(players){
    // loop through all players
    // use map to compare selected player to all players

    for(let i=0;i<players.length;i++){
        players.forEach((element, index, array)=>{
            if(index == i){
                return
            } 
            let outcome = 0.0
            if(players[i].score > element.score){
                outcome = 0
            }
            else if(players[i].score == element.score){
                outcome = 0.5
            } 
            else if(players[i].score < element.score){
                outcome = 1
            }
            pointsEarned = eloFunction(
                parseFloat(players[i].rating), 
                parseFloat(element.rating), 
                parseFloat(players[i].kValue),
                outcome
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
}

function getPlayerInfoToCalculateElo(){
    return { rating: this.rating, k: this.kValue, score: this.score }
}

function isCSVFile(file){
    const csvPattern = /(\.csv)$/g
    if(file.match(csvPattern)){return true}
    return false
}

async function consoleProgram(){
    // get count of how many csv files to read
 
    let fileList = await new Promise((resolve, reject)=>{
        fs.readdir(path.resolve(__dirname + '/csv_folder'), (err, files)=>{
            let result = files.map((elem, index, array) =>{
                if (isCSVFile(elem)){ return path.resolve('./csv_folder/' + elem)}
            })
            resolve(result)
        })
    })

    let data = []
    for(let i=0;i<fileList.length;i++){
        let a = await createCSVFileReadPromise(fileList[i])
        data.push(a)
    }
    //console.log(data)
    
    console.log("\n")
    console.log("Running simulation...............")
    console.log("")
    console.log(`Format [NameA EloA NameB EloB PointsEarnedByA]`)
    console.log("")
    setTimeout(()=>{}, 500)

    fileList.forEach((elem, index, arr)=>{
        console.log("Running Elo Algorithm on file: " + elem)
        comparePlayerToAllPlayers(players = data[index])
        console.log('\n')
    })
    
     
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

