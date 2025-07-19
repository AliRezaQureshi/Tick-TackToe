const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader') 
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')
const year = document.getElementById('year').textContent = new Date().getFullYear()

//Initialize variables for the game

let player = 'X'
let isPausedGame = false
let isGameStart = false

// Array of input conditions

const inputCells = ['', '', '',
                    '', '', '',
                    '', '', ''
]

// Array of win conditions
const winConditions = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8], //rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
    [0, 4, 8], [2, 4, 6]// diagonal
]



// Add click even listeners to each cell

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
});

function tapCell(cell, index){
    //Ensure that the cell is empty and the game is not paused.
    if(cell.textContent == '' && !isPausedGame){
        isGameStart = true
        updateCell(cell, index)
        if (!checkWinner()){
            changePlayer()
            randomPick()
        }
        
    }
}

function updateCell(cell, index){
    cell.textContent = player
    inputCells[index] = player
    cell.style.color = (player =='X') ? '#1892EA' : '#A737FF'
}

function changePlayer(){
    player = (player == 'X') ? 'O' : 'X'
}

function randomPick() {
    // Pause the game to allow Computer to pick 
    isPausedGame = true

    setTimeout(() => {
        let randomIndex
        do{
            //Pick a random index
            randomIndex = Math.floor(Math.random()  * inputCells.length)
        } while (
            // ensure the cell is empty
            inputCells[randomIndex] != ''
        )
        
        //update the cell with Computer move
        updateCell(cells[randomIndex], randomIndex, player)
        if(!checkWinner()){
            changePlayer()
            // Switch back to Human player
            isPausedGame = false
            return
        }
        player = (player == 'X') ? 'O' : 'X'
        
    }, 1000) // delay computer move by 1 second
}

function checkWinner(){
    for (const [a, b, c] of winConditions){
        //check each winning condition

        if(inputCells[a] == player && inputCells[b] == player && inputCells[c] == player){
            declareWinner([a, b, c])
            return true
        }
        
    }

    // check for draw if all the cells are filled
    if(inputCells.every(cell => cell != '')){
        declareDraw()
        return true
    }
}

function declareWinner(winningIndices) {
    showConfetti()
    titleHeader.textContent = `${player} Wins!`
    isPausedGame = true
    
    
    // highlight winning cells
    winningIndices.forEach((index) => 
        cells[index].style.background = '#2a2343'
    
    )
    restartBtn.style.visibility = 'visible'
}
function declareDraw() {
    shakeBoard()
    titleHeader.textContent = 'Draw'
    isPausedGame = true
    restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer){
    // Ensure the game hasn't started
    if (!isGameStart){
        // Override the selected player value
        player = selectedPlayer
        if (player == 'X'){
            //Highlight  X display
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        }else {
            xPlayerDisplay.classList.remove('player-active')
            oPlayerDisplay.classList.add('player-active')
        }
    }
}


restartBtn.addEventListener('click', () => {
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('')
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
        isPausedGame = false
        isGameStart = false
        titleHeader.textContent = 'Choose'
    })
})


function showConfetti() {
    confetti({
        particleCount: 250,
        spread: 150,
        origin: { y: 0.4 }
    });
}





function shakeBoard() {
    const board = document.querySelector('#main'); // adjust to your container
    board.classList.add('shake');
    setTimeout(() => board.classList.remove('shake'), 500);
}
