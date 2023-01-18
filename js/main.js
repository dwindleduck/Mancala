/*----- constants -----*/
const gamesBucket = [] // nice way to handle keeping score from multiple games! 

/*----- state variables -----*/ // <3 love the comment style for sections
let currentGameIndex

/*----- cached elements  -----*/
const playArea = document.querySelector("#playArea")
const gameBoard = document.querySelector("#gameBoard")
const gameTitle = document.querySelector("#gameTitle")
const player1Username = document.querySelector("#player1Username")
const player2Username = document.querySelector("#player2Username")
const notificationArea = document.querySelector("#notificationArea")
const turnIndicator = document.querySelector("#turnIndicator")

const instructionsButton = document.querySelector("#instructionsButton")
const instructions = document.querySelector("#instructions")
const newGameButton = document.querySelector("#newGameButton")
const resetButton = document.querySelector("#resetButton")

/*----- event listeners -----*/ // i would have event listeners last but that's a preference 
//show/hide the instructions
instructionsButton.addEventListener("click", () => {
    //IF the instructions are hidden, show them
    if(instructions.classList.contains("hide")){
        instructions.classList.remove("hide")
        newGameButton.classList.add("hide")
        resetButton.classList.add("hide")
        playArea.classList.add("hide")
        instructionsButton.innerText = "Back"
    } else {
        instructions.classList.add("hide")
        newGameButton.classList.remove("hide")
        playArea.classList.remove("hide")
        instructionsButton.innerText = "Instructions"
        //IF there is a game going on, show the reset button
        if(gamesBucket.length>0) {
            resetButton.classList.remove("hide")
        }
    }
})

//New Game Button
newGameButton.addEventListener("click", () => {
    gameBoard.innerHTML = ""
    const gameObject = new GameBoard("Player 1", "Player 2") 
    gamesBucket[0] = gameObject
    currentGameIndex = gamesBucket.indexOf(gameObject)
})

//Reset Game Button
resetButton.addEventListener("click", () => {
    gamesBucket[currentGameIndex].reset()
})




/*----- functions -----*/ // I think this should be classes instead - semantics 
class GameBoard {
    constructor(player1name, player2name) {
        this.name = player1name + " v " + player2name
        this.p1Username = player1name
        this.p2Username = player2name
        this.side1 = []
        this.store1 = undefined
        this.side2 = []
        this.store2 = undefined
        this.player1Turn = true
        //for event listeners, this will be an array of the Pit DOM elements
        this.pits = undefined 

        //create stonesList with unique identifiers
        //use stonesList as the 'holding' array during game play
        //also use during board reset
        this.stonesList = []
        const colorList = ["red", "blue", "green", "purple"]
        for(let i=0; i<48; i++){
            //create a stone, attach a name and a color
            let stone = {
                name: `stone${i}`,
                color: colorList[i%colorList.length] // love this use of %
            }
            this.stonesList.push(stone)
        }

        this.createPits()
        gameBoard.style.display = "grid"
        gameTitle.innerText = this.name

        player1Username.innerText = this.p1Username
        player1Username.classList.remove("hide")
        player2Username.innerText = this.p2Username
        player2Username.classList.remove("hide")

        notificationArea.innerHTML = ""
        notificationArea.classList.remove("hide")
        turnIndicator.classList.remove("hide")
        turnIndicator.innerText = "Player 1's Turn"
        resetButton.classList.remove("hide")

    }

    
    //Called when a pit is clicked on
    takeTurn(pitID) {
        let selectedPit = undefined
        let indexOfPit = 0
        let mySideOfTheBoard
        let otherSideOfTheBoard
        let myStore

        //when a pit is clicked on, remove old notification
        notificationArea.innerHTML = ""

        //initialize the local variables the selected pit is on the correct side
        if(this.player1Turn){
            //check if the selected pit is on side 1
            while(indexOfPit<this.side1.length && selectedPit === undefined){
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
            //check if the selected pit is on side2
            while(indexOfPit<this.side2.length && selectedPit === undefined){
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
        //from here it is your turn, a pit has been selected,
        //and the indexOfPit is +1 from the selected pit (couterclockwise)

        //move all stones from selected pit into holding array
        selectedPit.moveAllStonesIntoStonesList(this.stonesList)
    
        //Deposit the stones
        //starting counterclockwise, deposit one stone into each pit, skipping opponent's store
        while(this.stonesList.length>0) {
            
            //WHILE there are stones in holding and we are still on our side of the board
            while(this.stonesList.length>0 && indexOfPit < 6){
                mySideOfTheBoard[indexOfPit].contents.push(this.stonesList.pop())
                mySideOfTheBoard[indexOfPit].render()

                //IF LAST STONE is dropped in an empty space on my side
                if(this.stonesList.length === 0 && mySideOfTheBoard[indexOfPit].contents.length === 1){
                    //get the last stone back from our pit
                    mySideOfTheBoard[indexOfPit].moveAllStonesIntoStonesList(this.stonesList)
                    
                    //Capture stones in opposite space if they are there
                    let indexOfOppositePit = Math.abs(indexOfPit-5)
                    otherSideOfTheBoard[indexOfOppositePit].moveAllStonesIntoStonesList(this.stonesList)

                    //Drop them in my store
                    myStore.dropAllStonesHere(this.stonesList)
                    
                    //update notification area with "Captured!"
                    notificationArea.innerHTML = `<p>Captured!</p>`
                    this.switchTurns()
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
        this.switchTurns()
    }//END OF TAKE TURN // great helpful comment 


    findSideTotal(side) {
        let sideTotal = 0
        side.forEach(pit => {
            sideTotal += pit.contents.length
        })
        return sideTotal
    }


    checkForEndOfGame() {//returns true if game is over, else returns false
        //If Side1 is empty
        if(this.findSideTotal(this.side1) === 0) {
            //move all stones from side2 into holding then store2
            this.side2.forEach(pit => pit.moveAllStonesIntoStonesList(this.stonesList))
            this.store2.dropAllStonesHere(this.stonesList)
            return true //game over
        } 
        //Else If Side2 is emtpy
        else if(this.findSideTotal(this.side2) === 0) {
            //move all stones from side1 into holding then store1
            this.side1.forEach(pit => pit.moveAllStonesIntoStonesList(this.stonesList))
            this.store1.dropAllStonesHere(this.stonesList)
            return true //game over
        } 
        else {
            return false
        }
    }


    checkForWinner() {//called if end of game is true
        turnIndicator.classList.add("hide")
        player2Username.innerText = this.p2Username
        player1Username.innerText = this.p1Username

        //IF Player1 has more than Player2
        if(this.store1.contents.length > this.store2.contents.length) {
            notificationArea.innerHTML = `
            <p>Player 1 Wins</p>
            <p>${this.store1.contents.length} to ${this.store2.contents.length}</p>
            `
        }//IF Player 2 has more than Player1
        else if(this.store2.contents.length > this.store1.contents.length) {
            notificationArea.innerHTML = `
            <p>Player 2 Wins</p>
            <p>${this.store2.contents.length} to ${this.store1.contents.length}</p>
            `
        }//IF Its a Tie
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
            player1Username.innerText = "your turn --  " + this.p1Username
            player2Username.innerText = this.p2Username
        } else {
            turnIndicator.innerText = "Player 2's Turn"
            player1Username.innerText = this.p1Username
            player2Username.innerText = this.p2Username + "  -- your turn"
        }
    }

    //Empties out all Pits, then calls initialDistribution
    reset() {   
        //Get all the stones
        this.side1.forEach(pit => pit.moveAllStonesIntoStonesList(this.stonesList))
        this.side2.forEach(pit => pit.moveAllStonesIntoStonesList(this.stonesList))
        this.store1.moveAllStonesIntoStonesList(this.stonesList)
        this.store2.moveAllStonesIntoStonesList(this.stonesList)

        //Now all stones are back in the stonesList, so redistribute them
        this.initialDistribution(4)
        
        this.player1Turn = false
        this.switchTurns()
    }

    //this should only be called on an empty board (during setup, reset)
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

    //called from the GameBoard constructor
    //This creates new Pit objects, adds them to their array
    createPits(){
        //Create Pits on side1
        for(let i=0; i<6; i++){
        const pitObject = new Pit(`A${i+1}`)
        this.side1.push(pitObject)
        }
        //Create Pits on side2
        for(let i=0; i<6; i++){
            const pitObject = new Pit(`B${i+1}`)
            this.side2.push(pitObject)
        }
        //create stores
        this.store1 = new Pit("Store1")
        this.store2 = new Pit("Store2")

        //Grab all Pits from the DOM, put them in an array
        this.pits = document.querySelectorAll(".pit")
        
        //Event Listener's for pits
        this.pits.forEach(pit => {
            pit.addEventListener("click", (e) => {
                this.takeTurn(e.currentTarget.getAttribute("id"))
                if(this.checkForEndOfGame()) {this.checkForWinner()}
            })
        })
    //distribute stones
    this.initialDistribution(4)
    }
}


// inconsistent white space
// no label comment for this class 
class Pit {
    constructor(name) {
        this.name = name
        this.contents = []

        //Initial Drawing
        this.pitDisplay = document.createElement("div")
        this.pitDisplay.classList.add("pit")
        this.pitDisplay.setAttribute("id", this.name)
        this.pitDisplay.innerHTML = `
            <p class="name">${this.name}</p>
            <p class="stoneCount">${this.contents.length}</p>
            <ul class="stonesContainer"></ul>
            `
        gameBoard.appendChild(this.pitDisplay)
    }


    isEmpty() {
        return this.contents.length === 0 // indentation was off a space here
    }


    moveAllStonesIntoStonesList(stonesList) {
        for(let i=this.contents.length; i>0; i--){
            stonesList.push(this.contents.pop())
            this.render()
            //need to add some animation stuff here or in the render() function
        }
    }


    dropAllStonesHere(stonesList) {
        while(stonesList.length>0){
            this.contents.push(stonesList.pop())
        }
        this.render()
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
        if(this.isEmpty()){
            //wipes out all <li>
            stonesContainer.innerHTML = ""
        }// Else IF not enough <li>
        else if(stonesContainer.childElementCount < this.contents.length) { // love this conditional
            //add <li> until the same as in the pit (this should handle +1 stone)
            for(let i=stonesContainer.childElementCount; i<this.contents.length; i++){
                const li = document.createElement("li")
                li.style.backgroundColor = this.contents[i].color 
                stonesContainer.appendChild(li)
            } 
        }
    }
}