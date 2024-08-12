import {createContext, Dispatch} from "react";
import {AppState} from "./types";

export interface AppContext {
    state: AppState
    dispatch: () => void
}

export const initialState: AppState = {
    datasets: [],
    dataset: null,
    selectedDataset: "",
    selectedCovariates: [],
    uploadError: null,
    genericError: null,
    language: "en"
}

export enum ActionType {
    ERROR_ADDED = "ERROR_ADDED",
    UPLOAD_ERROR_ADDED = "UPLOAD_ERROR_ADDED",
    DATASETS_FETCHED = "DATASETS_FETCHED",
    DATA_FETCHED = "DATA_FETCHED",
    DATASET_SELECTED = "DATASET_SELECTED",
    SELECT_COVARIATE = "SELECT_COVARIATE",
    UNSELECT_COVARIATE = "UNSELECT_COVARIATE"
}

export interface RootAction {
    type: ActionType
    payload: any
}

export const rootReducer = (state: AppState, action: RootAction) => {
    console.log(action.type);
    switch (action.type) {
        case ActionType.ERROR_ADDED:
            return {...state, genericError: action.payload}
        case ActionType.UPLOAD_ERROR_ADDED:
            return {...state, uploadError: action.payload}
        case ActionType.DATASETS_FETCHED:
            return {...state, datasets: action.payload}
        case ActionType.DATASET_SELECTED:
            return {...state, selectedDataset: action.payload}
        case ActionType.DATA_FETCHED:
            return {...state, dataset: action.payload}
        case ActionType.SELECT_COVARIATE:
            return {...state, selectedCovariates: [...state.selectedCovariates, action.payload]}
        case ActionType.UNSELECT_COVARIATE:
            return {...state, selectedCovariates: state.selectedCovariates.filter(v => v.name !== action.payload)}
    }
}

export const RootContext = createContext<AppState>(initialState);
export const RootDispatchContext = createContext<Dispatch<RootAction>>(() => null);
