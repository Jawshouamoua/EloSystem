const GameClass = require('./GameClass')

function gameSortByDateTimeFn(a, b){
    let a_DateAndTime = a.getDateAndTimeOfGame()
    let b_DateAndTime = b.getDateAndTimeOfGame()

    if(!a_DateAndTime.isBefore || !b_DateAndTime.isBefore) {
         console.error("the date and time object in a game class, must be a 'dayjs' object")
         process.exit(1) 
    }

    if(a_DateAndTime.isBefore(b_DateAndTime)){
        return -1
    }
    else if(a_DateAndTime.isSame(b_DateAndTime)){
        return 0
    }
    else if(a_DateAndTime.isAfter(b_DateAndTime)){
        return 1
    }
}

class GamesManagerClass {

    constructor(gameList){
        this.gameList = gameList.sort(gameSortByDateTimeFn)
    }

    geDataFromGameUsingGameName(gameName){
        let gameData = this.gameList.find((game)=>{
            return game.getGameName() == gameName 
        })
        return gameData
    }

    getGamesList(){
        return this.gameList
    }

    getGamesThatPlayerIsIn(player){
        let gamesThatPlayerIsIn = this.gameList.filter((game)=>{
            return game.isPlayerInGame(player)
        })
        return gamesThatPlayerIsIn
    }

}

module.exports = GamesManagerClass