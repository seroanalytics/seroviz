import {AppState, DatasetSettings} from "../types";
import {ActionType, RootAction} from "../RootContext";

export const datasetReducer = (state: AppState, action: RootAction): AppState => {
    switch (action.type) {
        case ActionType.DATASET_SELECTED:
            return selectDataset(state, action)
        case ActionType.DATASET_METADATA_FETCHED:
            return {...state, datasetMetadata: action.payload}
        case ActionType.SELECT_COVARIATE:
            return selectCovariate(state, action)
        case ActionType.UNSELECT_COVARIATE:
            return unselectCovariate(state, action)
        case ActionType.SELECT_SCALE:
            return selectScale(state, action)
        default:
            return state
    }
}

const datasetSettings = (): DatasetSettings => ({
    covariateSettings: [],
    scale: "natural"
})

const selectDataset = (state: AppState, action: RootAction): AppState => {
    const newState = {...state}
    if (!newState.datasetSettings[action.payload]) {
        newState.datasetSettings[action.payload] = datasetSettings()
    }
    newState.selectedDataset = action.payload
    return newState
}

const selectCovariate = (state: AppState, action: RootAction): AppState => {
    const newState = {...state}
    const settings = newState.datasetSettings[state.selectedDataset].covariateSettings
    if (settings.indexOf(action.payload) === -1) {
        newState.datasetSettings[state.selectedDataset].covariateSettings = [...settings, action.payload]
    }
    return newState
}

const unselectCovariate = (state: AppState, action: RootAction) => {
    const newState = {...state}
    const settings = newState.datasetSettings[state.selectedDataset].covariateSettings
    newState.datasetSettings[state.selectedDataset].covariateSettings = settings.filter(v => v.name !== action.payload)
    return newState
}

const selectScale = (state: AppState, action: RootAction): AppState => {
    const newState = {...state}
    newState.datasetSettings[state.selectedDataset].scale = action.payload
    return newState
}
