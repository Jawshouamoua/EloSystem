const prompt = require('prompt-sync')()
const csv = require('fast-csv')
const fs = require('fs')
const path = require('path')

const [GameClass, eloModData] = require('./classes/GameClass')
const PlayerClass = require('./classes/PlayerClass')
const PlayerManagerClass = require('./classes/PlayersManagerClass')
const GamesManagerClass = require('./classes/GamesManagerClass')


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
// --------------------------------------------------------------------------------------------------------


// main
consoleProgram1()
// end of main

async function consoleProgram1(){
    // GameClass handles the elo calculation for each player of a particular game
    // PlayerClass gets the elo data from GameClass

    try{
        let fileList = await getCSVFilesFromDirectory(__dirname + '/csv_folder')
        let listOfGames = await getDataFromCSVFiles(fileList)

        let gamesManagerClass = new GamesManagerClass(listOfGames)

        let playerManager = new PlayerManagerClass()
        playerManager.initPlayerListFromGameDataArray(gamesManagerClass.getGamesList())
        playerManager.generateComparisonDataForEachPlayer(gamesManagerClass)

        //console.log(playerManager.getPlayerList())
        // ask user to specify a player to look up data 
        while(true){
            console.log('\n')
            console.log('Press enter to exit program')
            let playerName = prompt("Type the last name of the Player whose comparison history you would like to inspect: ").toUpperCase()
            if(playerName == ''){
                console.log('Exiting Program') 
                break 
            }

            try { var [result, multipleMatchWarning] = playerManager.getPlayerByLastName(playerName) }
            catch(e) {console.log(e)}

            //console.log(result)
            if (!result){ 
                console.log(`ERROR: could not find player with name '${playerName}'`)
                continue 
            }
            console.log()
            console.log("Comparison data ---------------------------------------------------------")
            result.displayComparisonDataAndUpdatePlayerData()

            if(multipleMatchWarning){
                console.log()
                console.log('Warning: multiple players with same last name were found')
            }
        }
    }
    catch(error){
        console.log(error)
        return
    }
}

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

function getFileNameStringFromPath(filePath){

    const pattern = /((\\|\/)([A-Za-z0-9\s-_])+\.csv)/g
    const pattern1 = /(([A-Za-z0-9\s-_])+\.csv)/g
    
    let res1 = filePath.match(pattern)

    if(!res1){ console.error("Error: Could not find csv file") }
    let res2 = res1[0].match(pattern1)
    if(res2.length > 1){ console.error("Regex pattern matching should return only 1 match") }
    return res2[0]
}

async function getDataFromCSVFiles(CSVfiles){
    let data = []
    for(let i=0;i<CSVfiles.length;i++){
        let fileName = getFileNameStringFromPath(CSVfiles[i])
        let rawData = await createCSVFileReadPromise(CSVfiles[i])
        data.push(new GameClass(rawData, fileName))
    }
    return data
}
