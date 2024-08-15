import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
    AppState,
    DatasetMetadata,
    PorcelainError,
    ResponseFailure,
    ResponseSuccess,
    SelectedCovariate,
    Variable
} from "../src/types";

export function mockAppState(state: Partial<AppState> = {}): AppState {
    return {
        datasetNames: [],
        datasetMetadata: null,
        selectedDataset: "",
        selectedCovariates: [],
        uploadError: null,
        genericError: null,
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
        xAxisVariable: "day",
        biomarkers: ["ab"],
        ...datasetMetadata
    }
}

export function mockVariable(variable: Partial<Variable> = {}): Variable {
    return {
        name: "sex",
        levels: ["F", "M"],
        ...variable
    }
}

export function mockSelectedCovariate(variable: Partial<SelectedCovariate> = {}): SelectedCovariate {
    return {
        name: "sex",
        levels: ["F", "M"],
        display: "trace",
        ...variable
    }
}

export function mockCovariate(variable: Partial<SelectedCovariate> = {}): SelectedCovariate {
    return {
        name: "c1",
        levels: ["1", "2"],
        display: "trace",
        ...variable
    }
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

export const mockError = (errorMessage: string): PorcelainError => {
    return {error: "OTHER_ERROR", detail: errorMessage};
};

export const mockAxios = new MockAdapter(axios);
