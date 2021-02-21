import { combineReducers } from "redux"


import scannerReducer from "./scanner/scanner.reducer"

export default combineReducers({
  scanner: scannerReducer,
})
