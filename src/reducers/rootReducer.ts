import {AppState} from "../types";
import {ActionType, RootAction} from "../RootContext";
import {datasetReducer} from "./datasetReducer";

export const rootReducer = (state: AppState, action: RootAction): AppState => {
    console.log(action.type);
    switch (action.type) {
        case ActionType.ERROR_ADDED:
            return {...state, genericError: action.payload}
        case ActionType.ERROR_DISMISSED:
            return {...state, genericError: null}
        case ActionType.UPLOAD_ERROR_ADDED:
            return {...state, uploadError: action.payload}
        case ActionType.UPLOAD_ERROR_DISMISSED:
            return {...state, uploadError: null}
        case ActionType.DATASET_NAMES_FETCHED:
            return {...state, datasetNames: action.payload}
        default:
            return datasetReducer(state, action)
    }
}
