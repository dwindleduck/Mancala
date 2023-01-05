

/*----- constants -----*/
const gamesBucket = []
let currentGameIndex




/*----- state variables -----*/




/*----- cached elements  -----*/
const playArea = document.querySelector("#playArea")
const gameBoard = document.querySelector("#gameBoard")
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
        playArea.classList.add("hide")
        instructionsButton.innerText = "Back"
    } else {
        instructions.classList.add("hide")
        playArea.classList.remove("hide")
        instructionsButton.innerText = "Instructions"
    }
})

//New Game Button
newGameButton.addEventListener("click", () => {
    //eventually get name as input, add functionality to switch between games
    const gameObject = new GameBoard("Player 1 v Player 2") 
    gamesBucket.push(gameObject)
    currentGameIndex = gamesBucket.indexOf(gameObject)
    
    createPits(gamesBucket[currentGameIndex])
    gameBoard.style.display = "grid"
    newGameButton.classList.add("hide")
    resetButton.classList.remove("hide")
})

//Reset Game Button
resetButton.addEventListener("click", () => {
    gamesBucket[currentGameIndex].reset()

})






/*----- functions -----*/


class GameBoard {
    constructor(name) {
        this.name = name

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

                    console.log(this.stonesList)
                    console.log(this.stonesList.length)
                    

                    //Drop them in my store
                    while(this.stonesList.length>0){
                        myStore.contents.push(this.stonesList.pop())
                    }
                    console.log(this.stonesList)
                    myStore.render()

                    //update notification area with "Captured!"
                    //check for end of game
                    this.player1Turn = !this.player1Turn
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
                    //do not change the turn indicator
                    //check for end of game
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
        //change turn indicator, change dom display
        this.player1Turn = !this.player1Turn
    }//END OF TAKE TURN





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
        this.player1Turn = true
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
