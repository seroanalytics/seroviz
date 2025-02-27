import {AppState} from "../types";
import {ActionType, initialState, RootAction} from "../RootContext";
import {datasetReducer} from "./datasetReducer";

export const rootReducer = (state: AppState, action: RootAction): AppState => {
    console.log(action.type);
    switch (action.type) {
        case ActionType.ERROR_ADDED:
            return {
                ...state,
                genericErrors: [...state.genericErrors, action.payload]
            }
        case ActionType.ERROR_DISMISSED:
            return {
                ...state,
                genericErrors: state.genericErrors.filter(e => e.detail !== action.payload.detail || e.error !== action.payload.error)
            }
        case ActionType.CLEAR_ALL_ERRORS:
            return {
                ...state,
                genericErrors: []
            }
        case ActionType.UPLOAD_ERROR_ADDED:
            return {...state, uploadError: action.payload}
        case ActionType.UPLOAD_ERROR_DISMISSED:
            return {...state, uploadError: null}
        case ActionType.DATASET_NAMES_FETCHED:
            return {...state, datasetNames: action.payload}
        case ActionType.PUBLIC_DATASETS_FETCHED:
            return {...state, publicDatasets: action.payload}
        case ActionType.SESSION_ENDED:
            return {...initialState}
        default:
            return datasetReducer(state, action)
    }
}
