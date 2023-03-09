let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');


// Connect four is a 7 x 6 grid
const width = canvas.width / 7;
const height = canvas.height / 6;

// Mouse position
let mousePos = 0;

// Winner
let winner = false;
let fourInARow = [];

// Player turn swapper -> 1 or 2
let currentTurn = 1;

// Save the last player turn
let lastPlayer = 1;

// Game state grid
let grid = [[0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]]

// Draw grid lines
function drawGrid() {
    
    // Draw the rectangles with circles in them
    for(let x = 0; x < 7; x++) {
        for(let y = 0; y < 6; y++) {

            // Set the coordinates of the current cell
            const posX = x * width;
            const posY = y * height;

            // Set the fill color for the rectangle
            ctx.fillStyle = 'green';
            ctx.strokeStyle = 'green';
            ctx.fillRect(posX, posY, width, height);
            ctx.strokeRect(posX, posY, width, height);
            

            // Cell is empty
            if(grid[x][y] == 0) {
                // Set the fill color for the circle
                ctx.fillStyle = '#ccc';
                const radius = 50;
                ctx.beginPath();
                ctx.arc(posX + width / 2, posY + height / 2, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
            // Cell is filled by red
            else if(grid[x][y] == 1) {
                // Set the fill color for the circle
                ctx.fillStyle = '#d00';
                const radius = 50;
                ctx.beginPath();
                ctx.arc(posX + width / 2, posY + height / 2, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
            // Cell is filled by blue
            else if(grid[x][y] == 2) {
                // Set the fill color for the circle
                ctx.fillStyle = '#00d';
                const radius = 50;
                ctx.beginPath();
                ctx.arc(posX + width / 2, posY + height / 2, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
            // Cell is filled by red and a cell in the four in a row
            else if(grid[x][y] >= 3) {
                // Set the fill color for the circle
                ctx.fillStyle = lastPlayer == 1 ? '#d00' : '#00d';
                const radius = 50;
                ctx.beginPath();
                ctx.arc(posX + width / 2, posY + height / 2, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                
                // Golden outline
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(posX + width / 2, posY + height / 2, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = "#dbc70f";
                ctx.stroke();
                ctx.lineWidth = 1;
            }

        }
    }   
}

// *******************************************************
// Check if there is a winner ****************************
// *******************************************************

// Check straight line
function checkStraights(x, y) {

    // Check horizontal line
    let horizontalLine =  0;
    for(let i = 0; i < 7; i++) {
        if(grid[i][y] == lastPlayer) {
            horizontalLine++;
            fourInARow.push([i, y]);
            if(horizontalLine == 4) {
                winner = true;
                return true;
            }
        }
        else {
            horizontalLine = 0;
            fourInARow = [];
        }
    }
    // Check vertical line
    let verticalLine = 0;
    for(let i = 0; i < 6; i++) {
        if(grid[x][i] == lastPlayer) {
            verticalLine++;
            fourInARow.push([x, i]);
            if(verticalLine == 4) {
                winner = true;
                return true;
            }
        }
        else {
            verticalLine = 0;
            fourInARow = [];
        }
    }
    fourInARow = [];
    return false;
}

// Check diagonal line
function checkDiagonals(x, y) {

    // Get to bottom right corner of 'X' formation
    let currX = x;
    let currY = y;
    while(currX > 0 && currY < 5) {
        currX--;
        currY++;
    }

    let fourInRow = 0;
    for(let i = 0; i < 7; i++) {
        if(currX + i > 5 || currY - i < 0) 
            break;
        if(grid[currX + i][currY - i] == lastPlayer) {
            fourInRow++;
            fourInARow.push([currX + i, currY - i]);
            if(fourInRow == 4) {
                winner = true;
                return true;
            }
        }
        else {
            fourInRow = 0;
            fourInARow = [];
        }
    }

    currX = x;
    currY = y;
    while(currX < 6 && currY < 5) {
        currX++;
        currY++;
    }

    fourInRow = 0;
    for(let i = 0; i < 7; i++) {
        if(currX - i < 0 || currY - i < 0) 
            break;
        if(grid[currX - i][currY - i] == lastPlayer) {
            fourInRow++;
            fourInARow.push([currX - i, currY - i]);
            if(fourInRow == 4) {
                winner = true;
                return true;
            }
        }
        else {
            fourInRow = 0;
            fourInARow = [];
        }
    }
    fourInARow = [];
    return false;
}

// Check if there is four in a row
function checkFourRow(x, y) {
    if(!checkDiagonals(x, y))
        checkStraights(x, y);

    if(winner) {
        fourInARow.forEach(item => {
            grid[item[0]][item[1]] = lastPlayer + 2;
        })
    }
}


// ******************************************************
// Mouse Events *****************************************
// ******************************************************

// Left mouse button pressed place a circle
canvas.addEventListener('mouseup', function(event) {

    if(!winner) {

        lastPlayer = currentTurn;
        let placementY = -1;

        // check if left mouse button is pressed
        if (event.button === 0) { 
            
            // Draw the rectangles with circles in them
            for(let y = 7; y >= 0; y--) {
                if(grid[mousePos - 1][y] == 0) {
                    placementY = y;
                    grid[mousePos - 1][y] = currentTurn;
                    currentTurn = currentTurn == 1 ? 2 : 1;
                    break;
                }
            }   

        }
        if(placementY != -1)
            checkFourRow(mousePos - 1, placementY);
    }
    drawGrid();
  });

// Get the and covert the mouse position to a column number
canvas.addEventListener('mousemove', function(event) {
    // Get the mouse coordinates relative to the viewport
    const mouseX = event.clientX;
  
    // Get the canvas element's bounding rectangle
    const canvasRect = canvas.getBoundingClientRect();
  
    // Calculate the mouse position relative to the canvas element
    mousePos = Math.ceil((mouseX - canvasRect.left) / width);
});


// ******************************************************
// Init Drawing *****************************************
// ******************************************************
drawGrid();
