export type GenericResponse<T> = ResponseSuccess<T> | ResponseFailure

export interface ResponseSuccess<T> {
    status: "success";
    data: T;
    errors: null;
}

export interface ResponseFailure {
    status: "failure";
    data: null;
    errors: PorcelainError[]
}

export interface PorcelainError {
    error: string
    detail: string | null
}

export interface TranslatableState {
    language: string
    updatingLanguage: boolean
}

type PlotDisplay = "facet" | "trace"

export interface Dict<T> {
    [index: string]: T
}

export interface PlotOptions {
    [index: string]: PlotDisplay
}

export interface PlotConfig {
    key: string
    displayName: string
    type: string
}

export interface Variable {
    key: string
    displayName: string
}

export interface Dataset {
    key: string
    displayName: string
    variables: Variable[]
    plots: PlotConfig[]
    xAxisVariable: Variable
}

export interface AppState {
    datasets: string[]
    selectedDataset: string
    selectedPlotOptions: PlotOptions
    uploadError: PorcelainError | null
    genericError: PorcelainError | null
    language: string
}
