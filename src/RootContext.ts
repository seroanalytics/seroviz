import {createContext, Dispatch} from "react";
import {AppState} from "./types";

export interface AppContext {
    state: AppState
    dispatch: () => void
}

export const initialState: AppState = {
    datasets: [],
    selectedDataset: "",
    selectedPlotOptions: {},
    uploadError: null,
    genericError: null,
    language: "en"
}

export enum ActionType {
    ERROR_ADDED = "ERROR_ADDED",
    UPLOAD_ERROR_ADDED = "UPLOAD_ERROR_ADDED",
    DATASETS_FETCHED = "DATASETS_FETCHED",
    DATASET_SELECTED = "DATASET_SELECTED"
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
    }
}

export const RootContext = createContext<AppState>(initialState);
export const RootDispatchContext = createContext<Dispatch<RootAction>>(() => null);
