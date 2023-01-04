

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


//New Game
newGameButton.addEventListener("click", () => {
    //eventually get name as input, add functionality to switch between games
    const gameObject = new GameBoard("Player 1 v Player 2") 
    gamesBucket.push(gameObject)
    currentGameIndex = gamesBucket.indexOf(gameObject)
    
    createPits(gamesBucket[currentGameIndex])
    
    newGameButton.classList.add("hide")
    resetButton.classList.remove("hide")
})
//Reset Game
resetButton.addEventListener("click", () => {
    gamesBucket[currentGameIndex].reset()

})






/*----- functions -----*/


class GameBoard {
    constructor(name) {
        this.name = name

        //create stonesList with decending names
        //use stonesList as the 'holding' array during game play
        //also use during board reset
        this.stonesList = []
        for(let i=48; i>0; i--){
            let stone = {name: `stone${i}`}
            this.stonesList.push(stone)
        }

        this.side1 = []
        this.store1 = undefined
        this.side2 = []
        this.store2 = undefined

        this.player1Turn = true
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
    }
}








class Pit {
    constructor(name) {
        this.name = name
        this.contents = []

        //Initial Drawing
        this.pitDisplay = document.createElement("div")
        this.pitDisplay.classList.add("pit")
        this.pitDisplay.classList.add(this.name)
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
        const stoneCount = this.pitDisplay.querySelector(".stoneCount")
        stoneCount.innerHTML = this.contents.length

        const stonesContainer = this.pitDisplay.querySelector(".stonesContainer")
        stonesContainer.innerHTML = ""
        for(let i=0; i<this.contents.length; i++){
            const li = document.createElement("li")   
            stonesContainer.appendChild(li)
        } 
    }
}


//This creates new Pit objects, adds them to their array
const createPits = (gameObject) => {
    //add to side1
    for(let i=0; i<6; i++){
        const pitObject = new Pit(`A${i+1}`)
        gameObject.side1.push(pitObject)
    }
    //create store 1
    gameObject.store1 = new Pit("Store1")
    
    //create store 2
    gameObject.store2 = new Pit("Store2")

    //add to side2
    for(let i=6; i>0; i--){
        const pitObject = new Pit(`B${i}`)
        gameObject.side2.push(pitObject)
    }
    gameObject.initialDistribution(4)
}




// initialize()

// function initialize() {
 
// }
