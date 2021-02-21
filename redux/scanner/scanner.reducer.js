import * as actions from "./scanner.actions"

export const initialState = {
  loading: false,
  hasErrors: false,
  isScanning: false,
  scanResult: "", // UPC barcode
  products: [], // array of all scanned products
  currentProduct: {}
}

export default function scannerReducer(state = initialState, action) {
  switch (action.type) {
    case actions.START_SCANNING:
      console.log('START_SCANNING')
      return { ...state, isScanning: true }
    case actions.SCAN_SUCCESS:
      console.log('SCAN_SUCCESS', action.payload)
      return { ...state, scanResult: action.payload }
    case actions.STOP_SCANNING:
      return { ...state, isScanning: false }
    case actions.GET_NUTRITION:
      console.log("GET_NUTRITION")
      return { ...state, loading: true }
    case actions.GET_NUTRITION_SUCCESS:
      console.log("GET_NUTRITION_SUCCESS")
      return {
        ...state,
        products: [action.payload, ...state.products],
        currentProduct: action.payload,
        loading: false,
        hasErrors: false,
      }
    case actions.GET_NUTRITION_FAILURE:
      return { ...state, loading: false, hasErrors: true }
    default:
      return state
  }
}
