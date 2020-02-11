export {useReducer, useState} from 'react'
export function WithDevtools(props) {
  return props.children
}

// import React from 'react'
// import {StateInspector, useReducer as useReducerWithDevtools, useState as useStateWithDevtools} from "reinspect"
// export function WithDevtools(props) {
//   return (
//     <StateInspector name="App">
//       {props.children}
//     </StateInspector>
//   )
// }
// export let useReducer = (...args) => useReducerWithDevtools(...args, state => state, "App")
// export let useState   = (...args) => useStateWithDevtools  (...args,                 "App")

export {useEffect, useContext, useRef} from 'react'