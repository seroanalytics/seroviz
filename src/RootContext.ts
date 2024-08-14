import {createContext, Dispatch} from "react";
import {AppState} from "./types";

export interface AppContext {
    state: AppState
    dispatch: () => void
}

export const initialState: AppState = {
    datasetNames: [],
    datasetMetadata: null,
    selectedDataset: "",
    selectedCovariates: [],
    uploadError: null,
    genericError: null,
    language: "en"
}

export enum ActionType {
    ERROR_ADDED = "ERROR_ADDED",
    ERROR_DISMISSED = "ERROR_DISMISSED",
    UPLOAD_ERROR_ADDED = "UPLOAD_ERROR_ADDED",
    UPLOAD_ERROR_DISMISSED = "UPLOAD_ERROR_DISMISSED",
    DATASET_NAMES_FETCHED = "DATASET_NAMES_FETCHED",
    DATASET_METADATA_FETCHED = "DATASET_METADATA_FETCHED",
    DATASET_SELECTED = "DATASET_SELECTED",
    SELECT_COVARIATE = "SELECT_COVARIATE",
    UNSELECT_COVARIATE = "UNSELECT_COVARIATE"
}

export interface RootAction {
    type: ActionType
    payload: any
}

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
        case ActionType.DATASET_SELECTED:
            return {...state, selectedDataset: action.payload}
        case ActionType.DATASET_METADATA_FETCHED:
            return {...state, datasetMetadata: action.payload}
        case ActionType.SELECT_COVARIATE:
            return {...state, selectedCovariates: [...state.selectedCovariates, action.payload]}
        case ActionType.UNSELECT_COVARIATE:
            return {...state, selectedCovariates: state.selectedCovariates.filter(v => v.name !== action.payload)}
    }
}

export const RootContext = createContext<AppState>(initialState);
export const RootDispatchContext = createContext<Dispatch<RootAction>>(() => null);
