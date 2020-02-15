export function makeBoard({width, height, bombCount}) {
  let rows =
    [...Array(height)].map((_, r) =>
      [...Array(width)].map((_, c) => ({
        bombed: false,
        flagged: false,
        revealed: false,
        // Denormalized context:
        location: [r, c],
        adjacentBombCount: 0,
        adjacentFlagCount: 0
      })))
  return {new: true, rows, bombCount, height, width}
}

export function copy(board) {
  let rows = board.rows.map(row => row.map(cell => ({...cell})))
  return {...board, rows}
}

export function toggleFlagged(board, location) {
  let cell = getCell(board, location)
  if (isDone(board) || cell.revealed) return board
  cell.flagged = !cell.flagged
  forEachAdjacent(board, location, (neighbor) => neighbor.adjacentFlagCount += cell.flagged ? 1 : -1)
  return board
}

export function select(board, location) {
  if (board.new) {
    initialize(board, location)
  } 
  let cell = getCell(board, location)
  if (cell.flagged || isDone(board)) return board
  if (!cell.revealed) {
    cell.revealed = true
    if (!cell.bombed) revealRegion(board, location)
  }
  else if (cell.adjacentBombCount === cell.adjacentFlagCount) {
    revealUnflaggedAdjacentRegions(board, location)
  }
  return board
}

export function isDone(board) {
  return (
      isLose(board) ? 'lose'
    : isWin(board)  ? 'win'
    : false
  )
}

export function isLose(board) {
  for (let row of board.rows) for (let cell of row)
    if (cell.revealed && cell.bombed) return true
  return false
}

export function isWin(board) {
  if (isLose(board)) return false
  let counts = getCounts(board)
  let correctFlagCount = counts.flagged === counts.bombed
  let allCellsKnown = counts.cells === counts.flagged + counts.revealed
  let isWon = correctFlagCount && allCellsKnown
  return isWon 
}

export function getCounts(board) {
  let counts = {
    bombed:   0,
    flagged:  0,
    revealed: 0
  }
  for (let row of board.rows) for (let cell of row)
    for (let k in counts) if (cell[k]) counts[k]++
  counts.cells = board.width * board.height
  return counts
}

function getCell(board, location) {
  let [row, column] = location
  return board.rows[row][column]
}

function initialize(board, location) {
  board.new = false
  let {rows, bombCount, width, height} = board
  let [row, column] = location
  let count = 0
  // Pick bomb locations
  while (count < bombCount) {
    let r = Math.floor(height * Math.random())
    let c = Math.floor(width  * Math.random())
    let tooClose =
         row    - 1 <= r && r <= row    + 1
      && column - 1 <= c && c <= column + 1
    if (tooClose || rows[r][c].bombed) continue
    rows[r][c].bombed = true
    count++
  }
  // Update `adjacentBombCount`
  for (let r = 0; r < board.height; r++)
    for (let c = 0; c < board.width; c++) {
      board.rows[r][c].adjacentBombCount = 0
      forEachAdjacent(board, [r, c], (adjacent) => adjacent.bombed && board.rows[r][c].adjacentBombCount++)
    }
  return board
}

function revealUnflaggedAdjacentRegions(board, location) {
  forEachAdjacent(board, location, (adjacent) => {
    if (!adjacent.flagged)
      adjacent.revealed = true
  })
  if (isDone(board)) return
  forEachAdjacent(board, location, (adjacent) => {
    if (!adjacent.flagged && 0 === adjacent.adjacentBombCount)
      revealRegion(board, adjacent.location)
  })
  return board
}

let visited = new Set()

// Reveal cell
// If no adjacent bombs, reveal regions of unflagged adjacents
function revealRegion(board, location) {
  recur(location)
  visited.clear()
  return board

  function recur(location) {
    let cell = getCell(board, location)
    if (visited.has(cell)) return; else visited.add(cell)
    // Main logic:
    cell.revealed = true
    if (0 === cell.adjacentBombCount)
      forEachAdjacent(board, location, (adjacent) => {
        if (!adjacent.flagged) recur(adjacent.location)
      })
  }
}

function forEachAdjacent(board, location, fn) {
  let [row, column] = location
  for (let c = column - 1; c <= column + 1; c++) {
    for (let r = row - 1; r <= row + 1; r++) {
      let inBounds =
           0 <= c && c < board.width
        && 0 <= r && r < board.height
      let notCenter = c !== column || r !== row
      if (inBounds && notCenter)
        fn(board.rows[r][c], [r, c], board)
    }
  }
}