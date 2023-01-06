

/*----- constants -----*/
const gamesBucket = []
let currentGameIndex




/*----- state variables -----*/




/*----- cached elements  -----*/
const playArea = document.querySelector("#playArea")
const gameBoard = document.querySelector("#gameBoard")
const gameTitle = document.querySelector("#gameTitle")
const player1Username = document.querySelector("#player1Username")
const player2Username = document.querySelector("#player2Username")

const notificationArea = document.querySelector("#notificationArea")
const turnIndicator = document.querySelector("#turnIndicator")

const moveSelector = document.querySelector("#moveSelector")
const instructionsButton = document.querySelector("#instructionsButton")
const instructions = document.querySelector("#instructions")
const newGameButton = document.querySelector("#newGameButton")
const resetButton = document.querySelector("#resetButton")






/*----- event listeners -----*/
//show/hide the instructions
instructionsButton.addEventListener("click", () => {
    if(instructions.classList.contains("hide")){
        instructions.classList.remove("hide")
        // newGameButton.classList.add("hide")
        // resetButton.classList.add("hide")
        playArea.classList.add("hide")
        instructionsButton.innerText = "Back"
    } else {
        instructions.classList.add("hide")
        // newGameButton.classList.remove("hide")
        // resetButton.classList.remove("hide")
        playArea.classList.remove("hide")
        instructionsButton.innerText = "Instructions"
    }
})

//New Game Button
newGameButton.addEventListener("click", () => {
    //eventually get name as input, add functionality to switch between games
    gameBoard.innerHTML = ""
    const gameObject = new GameBoard("Player 1", "Player 2") 
    gamesBucket[0] = gameObject
    //gamesBucket.push(gameObject) //use this for multiple games 
    currentGameIndex = gamesBucket.indexOf(gameObject)




    createPits(gamesBucket[currentGameIndex])
    gameBoard.style.display = "grid"
    gameTitle.innerText = gameObject.name

    player1Username.innerText = gameObject.p1Username
    // console.log(player1Username)
    player1Username.classList.remove("hide")
    player2Username.innerText = gameObject.p2Username
    player2Username.classList.remove("hide")

    notificationArea.innerHTML = ""
    notificationArea.classList.remove("hide")
    turnIndicator.classList.remove("hide")
    turnIndicator.innerText = "Player 1's Turn"
    newGameButton.classList.add("hide")
    resetButton.classList.remove("hide")
})

//Reset Game Button
resetButton.addEventListener("click", () => {
    gamesBucket[currentGameIndex].reset()

})






/*----- functions -----*/


class GameBoard {
    constructor(player1name, player2name) {
        this.name = player1name + " v " + player2name
        this.p1Username = player1name
        this.p2Username = player2name

        //create stonesList with unique identifiers
        //use stonesList as the 'holding' array during game play
        //also use during board reset
        this.stonesList = []
        for(let i=0; i<48; i++){
            let stone = {name: `stone${i}`}
            this.stonesList.push(stone)
        }

        this.side1 = []
        this.store1 = undefined
        this.side2 = []
        this.store2 = undefined

        this.player1Turn = true
        this.pits = undefined //for event listeners
    }



    
    takeTurn(pitID) {
        let selectedPit = undefined
        let indexOfPit = 0
        let mySideOfTheBoard
        let otherSideOfTheBoard
        let myStore

        //when a pit is clicked on, remove old notification
        notificationArea.innerHTML = ""

        //player1's turn
        if(this.player1Turn){
            //loop through side 1
            while(indexOfPit<this.side1.length && selectedPit === undefined){
                //for(let i=0; i<this.side1.length; i++){
                //IF the name of the current element matches the pitID
                if(this.side1[indexOfPit].name === pitID){
                    selectedPit = this.side1[indexOfPit]
                    mySideOfTheBoard = this.side1
                    otherSideOfTheBoard = this.side2
                    myStore = this.store1
                }
                indexOfPit++
            }
        } else { //player2's turn
            while(indexOfPit<this.side1.length && selectedPit === undefined){
                //for(let i=0; i<this.side2.length; i++){
                if(this.side2[indexOfPit].name === pitID){
                    selectedPit = this.side2[indexOfPit]
                    mySideOfTheBoard = this.side2
                    otherSideOfTheBoard = this.side1
                    myStore = this.store2
                }
                indexOfPit++
            }
        }
        if(selectedPit === undefined) return // break out of this function if not your turn
        //from here it is your turn,
        //a pit has been selected,
        //and the indexOfPit is +1 from the selected pit

        //move all stones from selected pit into holding array
        for(let i=selectedPit.contents.length; i>0; i--){
            this.stonesList.push(selectedPit.contents.pop())
            selectedPit.render()
            //need to add some animation stuff here or in the render() function
        }

        


        //deposit the stones
        //starting counterclockwise, deposit one stone into each pit, skipping opponent's store
        while(this.stonesList.length>0) {
            
            //WHILE there are stones in holding and we are still on our side of the board
            while(this.stonesList.length>0 && indexOfPit < 6){
                mySideOfTheBoard[indexOfPit].contents.push(this.stonesList.pop())
                mySideOfTheBoard[indexOfPit].render()

                //IF LAST STONE is dropped in an empty space on my side
                if(this.stonesList.length === 0 && mySideOfTheBoard[indexOfPit].contents.length === 1){
                    //get the last stone back from our pit
                    this.stonesList.push(mySideOfTheBoard[indexOfPit].contents.pop())
                    mySideOfTheBoard[indexOfPit].render()
                
                    
                    //Capture stones in opposite space if they are there
                   let indexOfOppositePit = Math.abs(indexOfPit-5)

                    for(let i = otherSideOfTheBoard[indexOfOppositePit].contents.length; i>0; i--){
                        this.stonesList.push(otherSideOfTheBoard[indexOfOppositePit].contents.pop())
                    }
                    otherSideOfTheBoard[indexOfOppositePit].render()

                    //Drop them in my store
                    while(this.stonesList.length>0){
                        myStore.contents.push(this.stonesList.pop())
                    }
                    myStore.render()

                    //update notification area with "Captured!"
                    notificationArea.innerHTML = `<p>Captured!</p>`
                    //animate fade away


                    //check for end of game
                    //this.checkForEndOfGame()
                    this.switchTurns()
                    //this.player1Turn = !this.player1Turn
                    return // ends the turn
                } 
                indexOfPit++
            }
            //After mySideOfTheBoard 
            //IF there are stones in holding, deposit one into my store
            if(this.stonesList.length>0){
                myStore.contents.push(this.stonesList.pop())
                myStore.render()

                //IF last stone is dropped in my store --> take another turn
                if(this.stonesList.length === 0){
                    //Update Notification Area with "Free Turn!"
                    notificationArea.innerHTML = `<p>Free Turn!</p>`
                

                    //check for end of game
                    //this.checkForEndOfGame()

                    //do not switchTurns()
                    return //ends the turn
                }
                indexOfPit = 0
            }
            //After dropping a stone in my store
            //If there are stones in holding, deposite on other side of the board
            while(this.stonesList.length>0 && indexOfPit < 6){
                otherSideOfTheBoard[indexOfPit].contents.push(this.stonesList.pop())
                otherSideOfTheBoard[indexOfPit].render()
                indexOfPit++
            }
            indexOfPit = 0 //reset to start again on my side of the board
            //omit the other player's store
        }
        //check for end of game
        //console.log("Game Over: " + this.checkForEndOfGame())
        //change turn indicator, change dom display
        this.switchTurns()
        // this.player1Turn = !this.player1Turn
    }//END OF TAKE TURN




    findSideTotal(side) {
        let sideTotal = 0
        for(let i=0; i<6; i++){ //loop side pits
            sideTotal += side[i].contents.length
        }
        return sideTotal
    }


    //check for end of game
    //returns true if game is over
    //else returns false
    checkForEndOfGame() {
        if(this.findSideTotal(this.side1) === 0) {
            //move all stones from side2 into holding then store2
            for(let j = 0; j<this.side2.length; j++) {
                for(let i=this.side2[j].contents.length; i>0; i--){
                    this.stonesList.push(this.side2[j].contents.pop())
                    this.side2[j].render()
                }
            }
            while(this.stonesList.length>0){
                this.store2.contents.push(this.stonesList.pop())
            }
            this.store2.render()
            return true //game over
        } 
        else if(this.findSideTotal(this.side2) === 0) {
            //move all stones from side1 into holding then store1
            for(let j = 0; j<this.side1.length; j++) {
                for(let i=this.side1[j].contents.length; i>0; i--){
                    this.stonesList.push(this.side1[j].contents.pop())
                    this.side1[j].render()
                }
            }
            while(this.stonesList.length>0){
                this.store1.contents.push(this.stonesList.pop())
            }
            this.store1.render()
            return true //game over
        } 
        else {
            return false
        }
    }

    //called if end of game is true
    checkForWinner() {
        turnIndicator.classList.add("hide")

        if(this.store1.contents.length > this.store2.contents.length) {
            notificationArea.innerHTML = `
            <p>Player 1 Wins</p>
            <p>${this.store1.contents.length} to ${this.store2.contents.length}</p>
            `
        }
        else if(this.store2.contents.length > this.store1.contents.length) {
            notificationArea.innerHTML = `
            <p>Player 2 Wins</p>
            <p>${this.store2.contents.length} to ${this.store1.contents.length}</p>
            `
        }
        else if(this.store2.contents.length === this.store1.contents.length) {
            notificationArea.innerHTML = `<p>It's a Tie!</p>`
        }
        newGameButton.classList.remove("hide")
        resetButton.classList.add("hide")
    }
                   

    switchTurns() {
        this.player1Turn = !this.player1Turn
        if(this.player1Turn) {
            turnIndicator.innerText = "Player 1's Turn"
        } else {
            turnIndicator.innerText = "Player 2's Turn"
        }
    }


    //this should only be called on an empty board
    initialDistribution(numStones) {
        //add to side1
        for(let i=0; i<6; i++){
            for(let j=0; j<numStones; j++){
                this.side1[i].contents.push(this.stonesList.pop())
            }
            this.side1[i].render()
        }
        //add to side2
        for(let i=0; i<6; i++){
            for(let j=0; j<numStones; j++){
                this.side2[i].contents.push(this.stonesList.pop())
            }
            this.side2[i].render()
        }
    }


    //Empties out all Pits, then calls initialDistribution
    reset() {
        //Side 1: loop through array of pits
        for(let i=0; i<this.side1.length; i++){
            //loop through array of stones
            for(let j=this.side1[i].contents.length; j>0; j--){
                //add the stones back to the holding array
                this.stonesList.push(this.side1[i].contents.pop())
            }
            this.side1[i].render()
        }
        //Side 2:
        for(let i=0; i<this.side2.length; i++){
            //loop through array of stones
            for(let j=this.side2[i].contents.length; j>0; j--){
                //add the stones back to the holding array
                this.stonesList.push(this.side2[i].contents.pop())
            }
            this.side2[i].render()
        }
        for(let i=this.store1.contents.length; i>0; i--){
            this.stonesList.push(this.store1.contents.pop())
            this.store1.render()
        }
        for(let i=this.store2.contents.length; i>0; i--){
            this.stonesList.push(this.store2.contents.pop())
            this.store2.render()
        }
        //Now all stones are back in the stonesList, so redistribute them
        this.initialDistribution(4)
        notificationArea.innerHTML = ""
        this.player1Turn = true
        turnIndicator.innerText = "Player 1's Turn"
    }
}








class Pit {
    constructor(name) {
        this.name = name
        this.contents = []

        //Initial Drawing
        this.pitDisplay = document.createElement("div")
        this.pitDisplay.classList.add("pit")
        // this.pitDisplay.classList.add(this.name)
        this.pitDisplay.setAttribute("id", this.name)
        this.pitDisplay.innerHTML = `
            <p class="name">${this.name}</p>
            <p class="stoneCount">${this.contents.length}</p>
            <ul class="stonesContainer"></ul>`
        for(let i=0; i<this.contents.length; i++){
            const li = document.createElement("li")    
            this.pitDisplay.querySelector(".stonesContainer").appendChild(li)
        }
        gameBoard.appendChild(this.pitDisplay)
        
    }

    isEmpty() {
       return this.contents.length === 0
    }

    //update the dom with stone count and stonecontainer
    render() {
        //stone count indicator
        const stoneCount = this.pitDisplay.querySelector(".stoneCount")
        stoneCount.innerHTML = this.contents.length

        //stone container
        const stonesContainer = this.pitDisplay.querySelector(".stonesContainer")
        //Add stones to the DOM
        
        //IF nothing in the pit
        if(this.contents.length === 0){
            //wipes out all <li>
            stonesContainer.innerHTML = ""
        }// Else IF not enough <li>
        else if(stonesContainer.childElementCount < this.contents.length) {
            //add <li> until the same as in the pit (this should handle +1 stone)
            for(let i=stonesContainer.childElementCount; i<this.contents.length; i++){
                const li = document.createElement("li")   
                stonesContainer.appendChild(li)
            } 
        }
    }
}






//called from the Event Listener on newGameButton
//This creates new Pit objects, adds them to their array
const createPits = (gameObject) => {
    //add to side2
    for(let i=0; i<6; i++){
        const pitObject = new Pit(`B${i+1}`)
        gameObject.side2.push(pitObject)
    }
    //add to side1
    for(let i=0; i<6; i++){
        const pitObject = new Pit(`A${i+1}`)
        gameObject.side1.push(pitObject)
    }
    //create stores
    gameObject.store1 = new Pit("Store1")
    gameObject.store2 = new Pit("Store2")

    gameObject.pits = document.querySelectorAll(".pit")
    
    //Event Listener's for pits
    gameObject.pits.forEach(pit => {
        pit.addEventListener("click", (e) => {
            gameObject.takeTurn(e.currentTarget.getAttribute("id"))
            if(gameObject.checkForEndOfGame()) {gameObject.checkForWinner()}
        })
    })

    //distribute stones
    gameObject.initialDistribution(4)
    // console.log(gameObject.side1)
    // console.log(gameObject.side2)

}











// initialize()

// function initialize() {

// }
