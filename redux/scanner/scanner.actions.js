export const START_SCANNING = "START_SCANNING"
export const STOP_SCANNING = "STOP_SCANNING"
export const SCAN_SUCCESS = "SCAN_SUCCESS"

export const GET_NUTRITION = "GET_NUTRITION"
export const GET_NUTRITION_SUCCESS = "GET_NUTRITION_SUCCESS"
export const GET_NUTRITION_FAILURE = "GET_NUTRITION_FAILURE"

export const startScanning = () => ({ type: START_SCANNING })
export const scanSuccess = (upc) => ({type: SCAN_SUCCESS, payload: upc})
export const stopScanning = () => ({ type: STOP_SCANNING })

export const getNutrition = () => ({ type: GET_NUTRITION })
export const getNutritionSuccess = (data) => ({
  type: GET_NUTRITION_SUCCESS,
  payload: data,
})
export const getNutritionFailure = () => ({ type: GET_NUTRITION_FAILURE })

export function fetchNutrition(upc) {
  return async (dispatch) => {
    dispatch(getNutrition(upc))

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${upc}.json`
      )
      const data = await response.json()

      dispatch(getNutritionSuccess(data))
    } catch (error) {
      dispatch(getNutritionFailure())
    }
  }
}
