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

export interface SelectedCovariate {
    name: string
    display: PlotDisplay
}

export interface Dataset {
    variables: string[]
    data: any[]
    xAxisVariable: string
}

export interface AppState {
    datasets: string[]
    dataset: Dataset | null
    selectedDataset: string
    selectedCovariates: SelectedCovariate[]
    uploadError: PorcelainError | null
    genericError: PorcelainError | null
    language: string
}
