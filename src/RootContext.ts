import {createContext, Dispatch} from "react";
import {AppState} from "./types";

export const initialState: AppState = {
    datasetNames: [],
    datasetMetadata: null,
    selectedDataset: "",
    selectedPlot: "population",
    datasetSettings: {},
    uploadError: null,
    genericErrors: [],
    language: "en"
}

export enum ActionType {
    ERROR_ADDED = "ERROR_ADDED",
    ERROR_DISMISSED = "ERROR_DISMISSED",
    CLEAR_ALL_ERRORS = "CLEAR_ALL_ERRORS",
    UPLOAD_ERROR_ADDED = "UPLOAD_ERROR_ADDED",
    UPLOAD_ERROR_DISMISSED = "UPLOAD_ERROR_DISMISSED",
    DATASET_NAMES_FETCHED = "DATASET_NAMES_FETCHED",
    DATASET_METADATA_FETCHED = "DATASET_METADATA_FETCHED",
    DATASET_SELECTED = "DATASET_SELECTED",
    DATASET_DELETED = "DATASET_DELETED",
    PLOT_SELECTED = "PLOT_SELECTED",
    SELECT_COVARIATE = "SELECT_COVARIATE",
    UNSELECT_COVARIATE = "UNSELECT_COVARIATE",
    SELECT_SCALE = "SELECT_SCALE",
    SET_SPLINE_OPTIONS = "SET_SPLINE_OPTIONS",
    SET_INDIVIDUAL_OPTIONS   = "SET_INDIVIDUAL_OPTIONS",
    SESSION_ENDED = "SESSION_ENDED"
}

export interface RootAction {
    type: ActionType
    payload: any
}

export const RootContext = createContext<AppState>(initialState);
export const RootDispatchContext = createContext<Dispatch<RootAction>>(() => null);
