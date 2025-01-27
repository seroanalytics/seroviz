import {
    DatasetMetadata,
    DatasetNames, ErrorDetail, PublicDatasets,
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

export interface CovariateSettings extends Variable {
    display: PlotDisplay
}

export interface SplineSettings {
    method: "gam" | "loess" | "auto"
    k: number
    span: number
}

export interface IndividualSettings {
    pid: string
    filter: string
    color: string
    linetype: string
}

export interface DatasetSettings {
    covariateSettings: CovariateSettings[]
    scale: "log" | "natural" | "log2"
    splineSettings: SplineSettings
    individualSettings: IndividualSettings
}

export interface AppState {
    datasetNames: DatasetNames
    publicDatasets: PublicDatasets
    datasetMetadata: DatasetMetadata | null
    selectedDataset: string
    selectedDatasetIsPublic: boolean
    datasetSettings: Dict<DatasetSettings>
    selectedPlot: "population" | "individual"
    uploadError: ErrorDetail | null
    genericErrors: ErrorDetail[]
    language: string
}
