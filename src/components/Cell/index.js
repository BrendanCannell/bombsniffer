import React from 'react'
import LongPress from "../LongPress"
import {Dispatch, GameDone} from "../../context"
import {useContext} from "../../hooks"
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import {library} from "@fortawesome/fontawesome-svg-core"
import {faBomb, faFlag} from "@fortawesome/free-solid-svg-icons"
import "./index.css"
library.add(faBomb, faFlag)


export default function Cell(props) {
  let {adjacentBombCount, bombed, flagged, location, revealed} = props
  let gameDone = useContext(GameDone)
  let dispatch = useContext(Dispatch)
  let select = () => {
    if (!flagged && !gameDone)
      dispatch({type: 'select',        location: location, time: Date.now()})
  }
  let toggleFlagged = (evt) => {
    if (evt) evt.preventDefault()
    if (!revealed && !gameDone)
      dispatch({type: 'toggleFlagged', location: location, time: Date.now()})
  }
  let className = [
      "cell",
      flagged  && "flagged",
      revealed && "revealed",
      gameDone && bombed && "bombed"
    ]
    .filter(Boolean).join(" ")
  let isVisibleBomb = bombed && (revealed || gameDone) && !flagged
  let center =
      flagged                           ? <Icon icon="flag" />
    : isVisibleBomb                     ? <Icon icon="bomb" />
    : revealed && adjacentBombCount > 0 ? adjacentBombCount
    : null
  return (
    <LongPress
      time={500}
      onLongPress={toggleFlagged}
      onPress={select}
    >
      <span
        className={className}
        onClick={select}
        onContextMenu={toggleFlagged}
        data-adjacent-bomb-count={revealed ? adjacentBombCount : null}
      >
        {center}
      </span>
    </LongPress>
  )
}