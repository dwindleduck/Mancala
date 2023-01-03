

/*----- constants -----*/

//create stonesList with decending names
//use stonesList as the 'holding' array during game play
//also use during board reset
const stonesList = []
for(let i=48; i>0; i--){
    let stone = {name: `stone${i}`}
    stonesList.push(stone)
}

/*----- state variables -----*/
const side1 = []
let store1
const side2 = []
let store2


/*----- cached elements  -----*/
const gameBoard = document.querySelector("#gameBoard")
const notificationArea = document.querySelector("#notificationArea")
const moveSelector = document.querySelector("#moveSelector")
const instructionsButton = document.querySelector("#instructionsButton")
const newGameButton = document.querySelector("#newGameButton")

/*----- event listeners -----*/


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
}






const createPits = () => {
    //add to side1
    for(let i=0; i<6; i++){
        const pitObject = new Pit(`A${i+1}`, 4)
        side1.push(pitObject)
    }//add to side2
    for(let i=0; i<6; i++){
        const pitObject = new Pit(`B${i+1}`, 4)
        side2.push(pitObject)
    }
    //create store 1
    store1 = new Pit("Store1", 0)
    //create store 2
    store2 = new Pit("Store2", 0)
}





//run game setup
initialize()

function initialize() {
    createPits()
    
    //Testing
    console.log(side1)
    console.log(store1)
    console.log(side2)
    console.log(store2)
}
