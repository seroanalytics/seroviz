import {
    DatasetMetadata,
    DatasetNames, ErrorDetail,
    ResponseFailure,
    Variable
} from "./generated";

export interface ResponseSuccess<T> {
    status: "success";
    data: T;
    errors: null;
}

export type GenericResponse<T> = ResponseSuccess<T> | ResponseFailure

type PlotDisplay = "facet" | "trace"

export interface Dict<T> {
    [index: string]: T
}

export interface SelectedCovariate extends Variable {
    display: PlotDisplay
}

export interface AppState {
    datasetNames: DatasetNames
    datasetMetadata: DatasetMetadata | null
    selectedDataset: string
    selectedCovariates: SelectedCovariate[]
    uploadError: ErrorDetail | null
    genericError: ErrorDetail | null
    language: string
}
