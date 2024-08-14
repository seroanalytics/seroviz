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

type PlotDisplay = "facet" | "trace"

export interface Dict<T> {
    [index: string]: T
}

export interface SelectedCovariate extends Variable {
    display: PlotDisplay
}

export interface Variable {
    name: string
    levels: string[]
}

export interface DatasetMetadata {
    variables: Variable[]
    biomarkers: string[]
    xAxisVariable: string
}

export interface AppState {
    datasetNames: string[]
    datasetMetadata: DatasetMetadata | null
    selectedDataset: string
    selectedCovariates: SelectedCovariate[]
    uploadError: PorcelainError | null
    genericError: PorcelainError | null
    language: string
}
