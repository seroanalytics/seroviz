import {
    AppState,
    DatasetSettings,
    IndividualSettings,
    SplineSettings
} from "../types";
import {ActionType, RootAction} from "../RootContext";

export const datasetReducer = (state: AppState, action: RootAction): AppState => {
    switch (action.type) {
        case ActionType.DATASET_SELECTED:
            return selectDataset(state, action)
        case ActionType.DATASET_DELETED:
            return deleteDataset(state, action)
        case ActionType.PLOT_SELECTED:
            return {...state, selectedPlot: action.payload}
        case ActionType.DATASET_METADATA_FETCHED:
            return {...state, datasetMetadata: action.payload}
        case ActionType.SELECT_COVARIATE:
            return selectCovariate(state, action)
        case ActionType.UNSELECT_COVARIATE:
            return unselectCovariate(state, action)
        case ActionType.SELECT_SCALE:
            return selectScale(state, action)
        case ActionType.SET_SPLINE_OPTIONS:
            return setSpline(state, action)
        case ActionType.SET_INDIVIDUAL_OPTIONS:
            return setIndividualOptions(state, action)
        default:
            return state
    }
}

const splineSettings = (): SplineSettings => ({
    method: "auto",
    span: 0.75,
    k: 10
})

const individualSettings = (): IndividualSettings => ({
    pid: "",
    color: "",
    linetype: "biomarker",
    filter: ""
})

const datasetSettings = (): DatasetSettings => ({
    covariateSettings: [],
    scale: "natural",
    splineSettings: splineSettings(),
    individualSettings: individualSettings()
})

const selectDataset = (state: AppState, action: RootAction): AppState => {
    const newState = {...state}
    if (!newState.datasetSettings[action.payload]) {
        newState.datasetSettings[action.payload] = datasetSettings()
    }
    newState.selectedDataset = action.payload
    return newState
}

const deleteDataset = (state: AppState, action: RootAction): AppState => {
    const newState = {...state}
    newState.datasetNames = newState.datasetNames.filter(d => d !== action.payload)
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

const setSpline = (state: AppState, action: RootAction): AppState => {
    const newState = {...state}
    const settings = newState.datasetSettings[state.selectedDataset].splineSettings;
    newState.datasetSettings[state.selectedDataset].splineSettings = {...settings, ...action.payload}
    return newState
}

const setIndividualOptions = (state: AppState, action: RootAction): AppState => {
    const newState = {...state}
    const settings = newState.datasetSettings[state.selectedDataset].individualSettings;
    newState.datasetSettings[state.selectedDataset].individualSettings = {...settings, ...action.payload}
    return newState
}
