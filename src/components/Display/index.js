import React from 'react'
import {useContext, useCallback} from "../../hooks"
import {Dispatch, GameDone} from "../../context"
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import {library} from "@fortawesome/fontawesome-svg-core"
import {faDizzy, faGrimace, faGrinBeamSweat, faSmile} from "@fortawesome/free-solid-svg-icons"
import "./index.css"
library.add(faDizzy, faGrimace, faGrinBeamSweat, faSmile)

function Display(props) {
  let dispatch = useContext(Dispatch)
  let newGame = useCallback(() => dispatch({type: 'newGame'}), [dispatch])
  let gameDone = useContext(GameDone)
  let icon = iconsByGameDone[gameDone]
  let formatDigits = n =>
    n >= 0
      ?       ( n % 1000).toString(10).padStart(3, "0")
      : "-" + (-n % 1000).toString(10).padStart(2, "0")
  return (
    <div className="header-container">
      <div className="header">
        <div className="bombs-remaining numbers">
          {formatDigits(props.bombsRemaining)}
        </div>
        <button className="new-game" onClick={newGame}>
          <Icon icon={icon} />
        </button>
        <div className="elapsed-seconds numbers">
          {formatDigits(props.elapsedSeconds)}
        </div>
      </div>
    </div>
  )
}

let iconsByGameDone = {
  win: faGrinBeamSweat,
  lose: faDizzy,
  false: faSmile
}

export default Display;
