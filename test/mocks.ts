import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
    AppState,
    ResponseSuccess,
    CovariateSettings, DatasetSettings
} from "../src/types";
import {
    DataSeries,
    DatasetMetadata,
    ErrorDetail,
    ResponseFailure,
    Variable
} from "../src/generated";

export function mockAppState(state: Partial<AppState> = {}): AppState {
    return {
        datasetNames: [],
        datasetMetadata: null,
        selectedDataset: "",
        datasetSettings: {},
        uploadError: null,
        genericErrors: [],
        language: "en",
        ...state
    }
}

export function mockDatasetNames(datasets: string[] = ["d1", "d2"]): string[] {
    return datasets
}

export function mockDatasetMetadata(datasetMetadata: Partial<DatasetMetadata> = {}): DatasetMetadata {
    return {
        variables: [mockVariable()],
        xcol: "day",
        biomarkers: ["ab"],
        ...datasetMetadata
    }
}

export function mockDatasetSettings(settings: Partial<DatasetSettings> = {}): DatasetSettings {
    return {
        covariateSettings: [],
        scale: "natural",
        ...settings
    }
}

export function mockVariable(variable: Partial<Variable> = {}): Variable {
    return {
        name: "sex",
        levels: ["F", "M"],
        ...variable
    }
}

export function mockSelectedCovariate(variable: Partial<CovariateSettings> = {}): CovariateSettings {
    return {
        name: "sex",
        levels: ["F", "M"],
        display: "trace",
        ...variable
    }
}

export function mockCovariate(variable: Partial<CovariateSettings> = {}): CovariateSettings {
    return {
        name: "c1",
        levels: ["1", "2"],
        display: "trace",
        ...variable
    }
}

export function mockSeriesData(): DataSeries {
    return [{
        name: "d1",
        model: {
            x: [],
            y: []
        },
        raw: {
            x: [],
            y: []
        }
    }]
}

export function mockSuccess<T>(data: T): ResponseSuccess<T> {
    return {
        data,
        status: "success",
        errors: null
    }
}

export const mockFailure = (errorMessage: string): ResponseFailure => {
    return {
        data: null,
        status: "failure",
        errors: [mockError(errorMessage)]
    }
};

export const mockError = (detail: string, error: string =  "OTHER_ERROR"): ErrorDetail => {
    return {error: error, detail: detail};
};

export const mockAxios = new MockAdapter(axios);
