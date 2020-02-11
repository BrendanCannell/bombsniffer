export function makeBoard({width, height, bombCount}) {
  let rows =
    [...Array(height)].map((_, r) =>
      [...Array(width)].map((_, c) => ({
        bombed: false,
        flagged: false,
        revealed: false,
        // Denormalized context:
        location: [r, c],
        adjacentBombCount: 0
      })))
  return {new: true, rows, bombCount, height, width}
}

export function copy(board) {
  let rows = board.rows.map(row => row.map(cell => ({...cell})))
  return {...board, rows}
}

export function toggleFlagged(board, location) {
  let [row, column] = location
  let cell = board.rows[row][column]
  if (!isDone(board))
    cell.flagged = !cell.flagged
  return board
}

export function select(board, location) {
  if (board.new) {
    setBombs(board, location)
    putDerived(board)
    board.new = false
  } 
  let [row, column] = location
  let cell = board.rows[row][column]
  if (!isDone(board) && !cell.flagged)
    if (cell.bombed)
      // Game over
      cell.revealed = true
    else
      revealRegion(board, location)
  return board
}

export function isDone(board) {
  let hasUnknownCell = false
  for (let row of board.rows) for (let cell of row) {
    if ( cell.revealed &&  cell.bombed)
      return 'lose'
    if (!cell.revealed && !cell.flagged)
      hasUnknownCell = true
  }
  return !hasUnknownCell ? 'win' : false
}

export function flaggedCount(board) {
  let count = 0
  for (let row of board.rows) for (let cell of row)
    cell.flagged && count++
  return count
}

function setBombs(board, location) {
  let {rows, bombCount, width, height} = board
  let [row, column] = location
  let count = 0
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
  return board
}

function putDerived(board) {
  for (let r = 0; r < board.height; r++)
    for (let c = 0; c < board.width; c++) {
      board.rows[r][c].adjacentBombCount = 0
      forEachAdjacent(board, [r, c], (adjacent) => adjacent.bombed && board.rows[r][c].adjacentBombCount++)
    }
  return board
}

let visited = new Set()

function revealRegion(board, location) {
  revealRegionAux(board, location)
  visited.clear()
  return board
}

function revealRegionAux(board, location) {
  let [row, column] = location
  let cell = board.rows[row][column]
  if (visited.has(cell) || cell.flagged) return
  cell.revealed = true
  visited.add(cell)
  if (0 === cell.adjacentBombCount)
    forEachAdjacent(board, location, (adjacent) => revealRegionAux(board, adjacent.location))
  return board
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