class PlayerClass {
    constructor(name, rating){
        this.name = name
        this.rating = rating
        this.comparisonData = []
        this.newRating = false
    }

    setComparisonData(compData){
        this.comparisonData.push(compData)
    }
    getComparisonData(){
        return this.comparisonData
    }
    displayPlayerData(){
        console.log(`Name: ${this.name}, Rating: ${this.rating}`)
    }

    displayComparisonData(){
        if(this.comparisonData.length == 0){ console.error("comparison data is empty") }

        let totalPointsEarned = 0
        console.log(`ComparisonData for ${this.name}, starting Elo: ${this.rating}`)
        //console.log(this.comparisonData)
        this.comparisonData.forEach((elem, index, arr)=>{
            console.log()
            console.log(`Comparison Data from Game: ${elem.gameName}`)
            elem.forEach((objectInData, i, arr1)=>{
                totalPointsEarned += objectInData.pointsEarned
                console.log(`Opponent_Stats[Name:${objectInData.name}, Rating: ${objectInData.rating}],  Outcome: ${objectInData.outcome}, Points_Earned: ${objectInData.pointsEarned}`)
            })
            
        })
        let newRating = this.rating + totalPointsEarned
        let newRatingRounded = newRating.toFixed(2)
        console.log(`Total Points Earned: ${totalPointsEarned}, New Elo for ${this.name}: ${newRatingRounded}`)
    }

    calculateNewRatingUsingComparisonData(){
        if(this.comparisonData.length == 0){ console.error("comparison data is empty") }
        if(!this.newRating) {return}

        let totalPointsEarned = 0
        this.comparisonData.forEach((elem, index, arr)=>{
            totalPointsEarned += elem.pointsEarned
        })
        this.newRating = this.rating + totalPointsEarned
    }

    displayPlayerData(){
        console.log(`Name: ${this.name}, Rating: ${this.rating}, Comparison History: ${this.comparisonData}`)
    }

    mergPlayerComparisonData(player){
        //console.log(this.comparisonData)
        this.comparisonData = [...this.comparisonData, ...player.getComparisonData()]
    }

}

module.exports = PlayerClass