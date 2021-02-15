function createTable() {

    let container = document.querySelector(".container");

    for (let i = 0; i < 9; i++) {

        let row = document.createElement("div");
        row.classList.add("row");
        
        container.append(row);

        for (let j = 0; j < 9; j++) {

            let cell = document.createElement("input");
            cell.setAttribute("type", "text");
            cell.classList.add("cell");        

            row.append(cell);
        }
    }
}

createTable();

// ----------------------------------------

let cells = document.querySelectorAll('.cell');
let rows = document.querySelectorAll('.row');
let cellWasChosen = false;

cells.forEach(cell => {
    cell.addEventListener('click', highlightAll);
});

// ---------------Highlights rows, columns and squares related to the clicked cell-----------

function highlightAll() {

    // remove all previous highlights if user clicked on the new cell
    if (cellWasChosen) {
        removeHighlight();
        cellWasChosen = false;
    }

    let row = this.parentElement;
    let cellsInRow = row.children;

    let columnIndex = findColumnIndex(row);
    let rowIndex = findRowIndex(cellsInRow, this);

    highlightRow(cellsInRow);
    highlightColumn(rowIndex);
    highlightSquare(rowIndex, columnIndex);
    
    this.style.background = '#5FB875';
    cellWasChosen = true;

}

function highlightRow(currentRow) {

    for (let i = 0; i < currentRow.length; i++) {    
        currentRow[i].style.background = 'lightgreen';
    }
}

function findRowIndex(currentRow, obj) {
    
    let index;

    for (let i = 0; i < currentRow.length; i++) {    
        if (currentRow[i] === obj) {
            index = i;
        }
    }
    return index;
}

function findColumnIndex(currentRow) {

    let index;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i] === currentRow) {
            index = i;
        }
    }
    return index;
}

function highlightColumn(currentCell) {

    for (let i = 0; i < rows.length; i++) {
        let columnCell = rows[i].children[currentCell];
        columnCell.style.background = 'lightgreen';
    }
}

function pickSquare(outer, outerMax, inner, innerMax) {

    for (let i = outer; i < outerMax; i++) {
        for (let j = inner; j < innerMax; j++) {

            // outer loop goes through rows, inner one loops through cells

            let cell = rows[i].children[j];
            cell.style.background = 'lightgreen';
        }
    }
}

function highlightSquare(rowNum, colNum) {

    if (rowNum < 3 && colNum < 3) {
        pickSquare(0, 3, 0, 3);
    } else if (rowNum < 6 && colNum < 3) {
        pickSquare(0, 3, 3, 6);
    } else if (rowNum < 9 && colNum < 3) {
        pickSquare(0, 3, 6, 9);
    } else if (rowNum < 3 && colNum < 6) {
        pickSquare(3, 6, 0, 3);
    } else if (rowNum < 6 && colNum < 6) {
        pickSquare(3, 6, 3, 6);
    } else if (rowNum < 9 && colNum < 6) {
        pickSquare(3, 6, 6, 9);
    } else if (rowNum < 3 && colNum < 9) {
        pickSquare(6, 9, 0, 3);
    } else if (rowNum < 6 && colNum < 9) {
        pickSquare(6, 9, 3, 6);
    } else {
        pickSquare(6, 9, 6, 9);
    }
}

function removeHighlight() {
    for (let cell of cells) {
        if (cell.style.background !== '') {
            cell.style.background = '';
        }
    }
}

// --------------------------------------------------------------------

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createEmptyArrays(num) {
    let res = [];
    for (let i = 0; i < num; i++) {
        res.push([]);
    }
    return res;
}

function createSudoku() {

    let rowSet = generateRow();         // need to use it more for better randomization
    let rBase = Array.from(rowSet);

    let rows = createEmptyArrays(9);
    let columns = createEmptyArrays(9);
    let squares = createEmptyArrays(9);

    function whichSquare(index, startSq, midSq, lastSq) {
        // determine to which square the current candidate number pertains to
        if (index < 3) {
            return startSq;
        } else if (index < 6) {
            return midSq;
        } else {
            return lastSq;
        }
    }

    function fillSudokuArrays(cRow, startSq, midSq, lastSq) {

        let n = 0;
        let cSquare = [];

        while (cRow.length !== 9) {

            if (n === 50) {
                console.log('Exceeded maximum iteration number');
                break;
            }

            for (let i = 0; i < 9; i++) {
                
                for (let j = 0; j < 9; j++) {

                    let cNum = rBase[j];
                    let cCol = columns[cRow.length];

                    cSquare = whichSquare(i, startSq, midSq, lastSq);

                    // if current number is not in the current row and column and square
                    if (!cRow.includes(cNum) && !cCol.includes(cNum) && !cSquare.includes(cNum)) {
                        // filling the current row
                        cRow.push(cNum);
                    }
                }
            }
            n++;
        }

        for (let i = 0; i < 9; i++) {
            // filling columns and squares
            columns[i].push(cRow[i]);
            cSquare = whichSquare(i, startSq, midSq, lastSq);
            cSquare.push(cRow[i]);  
        }
    }

    fillSudokuArrays(rows[0], squares[0], squares[1], squares[2]);
    fillSudokuArrays(rows[1], squares[0], squares[1], squares[2]);
    fillSudokuArrays(rows[2], squares[0], squares[1], squares[2]);

    fillSudokuArrays(rows[3], squares[3], squares[4], squares[5]);
    fillSudokuArrays(rows[4], squares[3], squares[4], squares[5]);
    fillSudokuArrays(rows[5], squares[3], squares[4], squares[5]);

    fillSudokuArrays(rows[6], squares[6], squares[7], squares[8]);
    fillSudokuArrays(rows[7], squares[6], squares[7], squares[8]);
    fillSudokuArrays(rows[8], squares[6], squares[7], squares[8]);

    return rows;
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// generates and returns a random row 1-9
function generateRow() {

    let row = new Set();
    while (row.size < 9) {
        row.add(randomNum(1,10));
    }
    return row;
}

console.log(createSudoku());




