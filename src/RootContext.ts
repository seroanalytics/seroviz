import {createContext, Dispatch} from "react";
import {AppState} from "./types";

export const initialState: AppState = {
    datasetNames: [],
    datasetMetadata: null,
    selectedDataset: "",
    datasetSettings: {},
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
    UNSELECT_COVARIATE = "UNSELECT_COVARIATE",
    SELECT_SCALE = "SELECT_SCALE"
}

export interface RootAction {
    type: ActionType
    payload: any
}

export const RootContext = createContext<AppState>(initialState);
export const RootDispatchContext = createContext<Dispatch<RootAction>>(() => null);
