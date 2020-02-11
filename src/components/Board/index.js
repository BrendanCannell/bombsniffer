import React, {useContext} from 'react'
import {GameDone} from "../../context"
import Cell from "../Cell"
import "./index.css"

export default function Board(props) {
  let rows = props.rows.map((row, i) => <Row cells={row} key={i} />)
  let gameDone = useContext(GameDone)
  let className = [
      "board",
      gameDone && "game-done"
    ]
    .filter(Boolean).join(" ")
  return (
    <div className={className}>
      {rows}
    </div>
  )
}

function Row(props) {
  let cells = props.cells.map(cell => <Cell {...cell} key={cell.location} />)
  return (
    <span className="row">
      {cells}
    </span>
  )
}