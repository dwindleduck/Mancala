

/*----- constants -----*/

//create stonesList with decending names
//use stonesList as the 'holding' array during game play
//also use during board reset
const stonesList = []
for(let i=48; i>0; i--){
    let stone = {name: `stone${i}`}
    stonesList.push(stone)
}


const side1 = []
let store1
const side2 = []
let store2

/*----- state variables -----*/
let player1Turn = true


/*----- cached elements  -----*/
const playArea = document.querySelector("#playArea")
const gameBoard = document.querySelector("#gameBoard")
const notificationArea = document.querySelector("#notificationArea")
const turnIndicator = document.querySelector("#turnIndicator")

const moveSelector = document.querySelector("#moveSelector")
const instructionsButton = document.querySelector("#instructionsButton")
const instructions = document.querySelector("#instructions")
const newGameButton = document.querySelector("#newGameButton")

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

/*----- functions -----*/





class Pit {
    constructor(name, numStones) {
        this.name = name
        this.contents = []
        for(let i=0; i<numStones; i++){
            this.contents.push(stonesList.pop())
        }
    }

    isEmpty() {
       return this.contents.length === 0
    }
    render() {
        const pitDisplay = document.createElement("div")
        pitDisplay.classList.add("pit")
        pitDisplay.innerHTML = `
            <p>${this.name}</p>
            <p>${this.contents.length}</p>
            <ul class="stones"></ul>`
        for(let i=0; i<this.contents.length; i++){
            const li = document.createElement("li")    
            pitDisplay.querySelector(".stones").appendChild(li)
        }
        gameBoard.appendChild(pitDisplay)
    }
}







const createPits = () => {
    //add to side1
    for(let i=0; i<6; i++){
        const pitObject = new Pit(`A${i+1}`, 4)
        side1.push(pitObject)
        pitObject.render()
    }
    //create store 1
    store1 = new Pit("Store1", 0)
    store1.render()

    //add to side2
    for(let i=0; i<6; i++){
        const pitObject = new Pit(`B${i+1}`, 4)
        side2.push(pitObject)
        pitObject.render()
    }
    //create store 2
    store2 = new Pit("Store2", 0)
    store2.render()
}





//run game setup
initialize()

function initialize() {
    createPits()
}
