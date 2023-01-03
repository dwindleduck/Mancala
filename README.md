# Game: Mancala

## Basic Instructions 
Referenced primarily from https://endlessgames.com/wp-content/uploads/Mancala_Instructions.pdf
### Game Set Up
- Both sides of the board have six 'pits'
- Each pit starts with for 'stones' totaling 48 stones on the board
- Facing their side of the board, each player has a 'store' to the right 

### Object of the game:
- To collect the most 'stones' in your 'store' by the end of the game
- The game ends when one side of the board is empty


### Rules
- To make a move, pick up all of the stones from one pit on your side of the board
 - Starting counterclockwise from the selected pit, deposit one stone into each pit; including your store but skipping your opponent's store
 - If the last stone you drop is in your store, you get another turn
 - If the last stone you drop is in an empty pit on your side of the board, you capture that stone and all stones in the oponent's pit direcetly opposite.
 - Captured pieces go to your store
 - When one side of the board is completely empty, the player with stones left on their side of the board captures those pieces
 - The player with the most stones in their store is the winner

---






## Wireframes
![Wireframe](https://github.com/dwindleduck/Mancala/blob/main/assets/Wireframe-P%26L.png)

---

## User Stories
- As a user, I want to see the game board
- As a user, I want to start a game
- As a user, I want to know who's turn it is
- As a user, I want to be able to tap or click a pit to select my move
- As a user, I want optional large selector buttons below the board for easy move selection
- As a user, I want lables for the pits
- As a user, I want a stone-count indicator for each pit
- As a user, I want to see stones deposited counterclockwise into pits
- As a user, I want to see the results of my turn (free turn, captured stones, etc)
- As a user, I want to skip my oponents store
- As a user, I want to take another turn if the last stone was dropped into my store
- As a user, I want to be able to capture the stones opposite the last pit landed in on my side of the board
- As a user, I want to have the game end when one side of the board is empty
- As a user, I want the player with stones left on their side of the board to capture those stones
- As a user, I want to know who has the most stones in their store
- As a user, I want to be able to keep track of wins/losses (game score)
- As a user, I want to start a new game
- As a user, I want to reset the game score

- As a user, I want to be able to choose appearance of the stones
- As a user, I want to be able to play against another human
- As a user, I want see the avatar and username of who is playing
- As a user, I want to be able to select my username
- As a user, I want choose my avatar
- As a user, I want to be able to play against the computer
- As a user, I want to choose the difficulty level when playing against the computer
- As a user, I want to be able to toggle rules on and off
- As a user, I want to be able to save a game to resume later
- As a user, I want a tutorial page with basic instructions, rules, etc.
- As a user, I want to select who goes first
- As a user, I want who goes first to alternate every game
- As a user, I want to be able to share my wins on social media
- As a user, I want to be able to link to gaming platforms and leaderboards
- As a user, I want to be able to play online
- As a user, I want sound effects
- As a user, I want a Winner animation














---

## MVP
- As a user, I want an instructions page with basic setup, rules, etc.
- As a user, I want to see the game board
- As a user, I want lables for the pits
- As a user, I want a stone-count indicator for each pit
- As a user, I want to start a game
- As a user, I want to know who's turn it is
- As a user, I want to be able to play against another human on the same device

- As a user, I want an option for a move selector below the gameboard (accessible options picker)
- As a user, I want to be able to tap or click a pit to select my move

- As a user, I want to see stones deposited counterclockwise into pits
- As a user, I want to see the results of my turn (free turn, captured stones, etc)
- As a user, I want to skip my oponents store
- As a user, I want to take another turn if the last stone was dropped into my store
- As a user, I want to be able to capture the stones opposite the last pit landed in on my side of the board
- As a user, I want to have the game end when one side of the board is empty
- As a user, I want the player with stones left on their side of the board to capture those stones
- As a user, I want to know who has the most stones in their store
- As a user, I want to reset the board and start a new game


---
## Version 2
- As a user, I want to be able to keep track of wins/losses (game score)
- As a user, I want to reset the game score
- As a user, I want to be able to save a game to resume later
- As a user, I want to select who goes first on the first game
- As a user, I want who goes first to alternate every game

- As a user, I want to be able to choose appearance of the stones
- As a user, I want to be able to select my username
- As a user, I want choose my avatar
- As a user, I want see the avatar and username of who is playing


---
## Version 3
- As a user, I want to be able to play against the computer
- As a user, I want to choose the difficulty level when playing against the computer
- As a user, I want to be able to toggle specific rules on and off
- As a user, I want a tutorial walk-through of game play

- As a user, I want to be able to share my wins on social media
- As a user, I want to be able to link to gaming platforms and leaderboards
- As a user, I want to be able to play online with other humans
- As a user, I want sound effects
- As a user, I want a Winner animation









---
## MVP with pseudocode

- As a user, I want an instructions page with basic setup, rules, etc.
```
IF the user clicks the Instructions button
    Display the instructions
```

- As a user, I want to see the game board
```
Each side of the board is an array of pit objects
Each pit is an object containing a name and an array of stones
Each store is a pit object
All stones are used interchangably, but will eventually have unique characteristics like color
```

- As a user, I want lables for the pits
```
Get the name of each pit
    Print the names
```

- As a user, I want a stone-count indicator for each pit
```
For each pit, find the length of the array (stone count)
    Print the stone count
Refresh the count any time the length of the array changes
```

- As a user, I want to start a new game
```
IF the user clicks the Start A New Game button
    Empty out the stores
    Reset all pits to hold 4 stones
```

- As a user, I want to know who's turn it is
```
Turn indicator toggle variable (boolean)
IF the turn indicator toggle is true
    Display it is the user's turn
ELSE
    Display it is the opponent's turn
When a turn is over, flip the toggle
```

- As a user, I want to be able to play against another human on the same device
```
IF the turn indicator toggle false
    Let Player 2 choose their move
```

- As a user, I want an accessible options picker on small screens
```
IF the sceen is small
    Display the accessible options picker
```
- As a user, I want to be able to tap or click a pit to select my move
```
When the user chooses a pit (click, tap, or input selector)
    Move the stones from that pit into a 'holding' array
```

- As a user, I want to see stones deposited counterclockwise into pits
```
Starting counterclockwise from the selected pit, deposit one stone into each pit until the holding array is empty
```

- As a user, I want to skip my opponent's store
```
When depositing stones...
IF the next pit is the user's store
    Deposit a stone
ELSE IF the next pit is the opponents store
    Do not deposit a stone, move on to the next pit
```

- As a user, I want to see the results of my turn (free turn, captured stones, etc)
```
After a turn is complete
    Display the results of the turn in the Notification Area
```

- As a user, I want to take another turn if the last stone was dropped into my store
```
IF the last stone the user drops is into their store
    Take another turn
```

- As a user, I want to be able to capture the stones opposite the last pit landed in on my side of the board
```
IF the last stone the user drops is in an empty space on their side of the board
    Capture the stones on the opposite side of the board
        Deposit them all into your store
```

- As a user, I want to have the game end when one side of the board is empty
- As a user, I want the player with stones left on their side of the board to capture those stones
```
IF one side of the board is empty
    All stones from the non-empty side get deposited into that side's store
    The game is over
```

- As a user, I want to know who has the most stones in their store
```
Print the totals of the contents of both stores
IF the user's store has more stones than the opponent's store
    Display that the user won
ELSE
    Dispay that the opponent won
```
