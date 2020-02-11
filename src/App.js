import React from 'react'
import {useEffect, useReducer, useState} from "./hooks"
import Board from "./components/Board"
import * as B from "./bombsniffer"
import {Dispatch, GameDone} from "./context"

let boardSpec = {width: 9, height: 9, bombCount: 10}
// let boardSpec = {width: 3, height: 3, bombCount: 1}
function reset() {
  return {
    board: B.makeBoard(boardSpec),
    startTime: null,
    endTime: null
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'select': {
      let board = B.select(B.copy(state.board), action.location)
      let startTime = state.startTime                      ? state.startTime : action.time
      let endTime   = (state.endTime  || !B.isDone(board)) ? state.endTime   : action.time
      return {...state, board, startTime, endTime}
    }
    case 'toggleFlagged': {
      let board = B.toggleFlagged(B.copy(state.board), action.location)
      let endTime   = (state.endTime  || !B.isDone(board)) ? state.endTime : action.time
      return {...state, board, endTime}
    }
    case 'newGame':
      return reset()
    default:
      throw Error("Unknown action type")
  }
}

function App() {
  let [state, dispatch] = useReducer(reducer, reset())
  let currentTime = useCurrentTime()
  let elapsedSeconds =
    state.startTime
      ? Math.floor(((state.endTime || currentTime) - state.startTime) / 1000)
      : 0
  return (
    currentTime &&
    <Dispatch.Provider value={dispatch}>
      <GameDone.Provider value={B.isDone(state.board)}>
        <p>
          {"Time: " + elapsedSeconds}
        </p>
        <p>
          {"Remaining: " + (state.board.bombCount - B.flaggedCount(state.board))}
        </p>
        <Board rows={state.board.rows} />
      </GameDone.Provider>
    </Dispatch.Provider>
  )
}

function useCurrentTime() {
  let [currentTime, setCurrentTime] = useState(Date.now())
  useEffect(() => {
    let request = requestAnimationFrame(updateTime)
    function updateTime() {
      request = requestAnimationFrame(updateTime)
      setCurrentTime(Date.now())
    }
    return () => request && cancelAnimationFrame(request)
  }, [])
  return currentTime
}

export default App;
