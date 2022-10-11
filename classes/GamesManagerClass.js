const GameClass = require('./GameClass')


class GamesManagerClass {

    constructor(gameList){
        this.gameList = gameList
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