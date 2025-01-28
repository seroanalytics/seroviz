import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
    AppState,
    ResponseSuccess,
    CovariateSettings, DatasetSettings, SplineSettings, IndividualSettings
} from "../src/types";
import {
    DataSeries,
    DatasetMetadata,
    ErrorDetail, Plotly,
    ResponseFailure,
    Variable
} from "../src/generated";

export function mockAppState(state: Partial<AppState> = {}): AppState {
    return {
        datasetNames: [],
        publicDatasets: [],
        datasetMetadata: null,
        selectedDataset: "",
        selectedDatasetIsPublic: false,
        selectedPlot: "population",
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
        type: "surveillance",
        ...datasetMetadata
    }
}

export function mockSplineSettings(settings: Partial<SplineSettings> = {}): SplineSettings {
    return {
        method: "auto",
        span: 0.75,
        k: 10,
        ...settings
    }
}

export function mockIndividualSettings(settings: Partial<IndividualSettings> = {}): IndividualSettings {
    return {
        pid: "",
        color: "",
        linetype: "biomarker",
        filter: "",
        ...settings
    }
}

export function mockDatasetSettings(settings: Partial<DatasetSettings> = {}): DatasetSettings {
    return {
        covariateSettings: [],
        scale: "natural",
        splineSettings: mockSplineSettings(),
        individualSettings: mockIndividualSettings(),
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
            x: [1, 2],
            y: [1, 2]
        },
        raw: {
            x: [1, 2],
            y: [1, 2]
        },
        warnings: []
    }]
}

export function mockPlotlyData(data: Partial<Plotly> = {}): Plotly {
    return {
        data: [],
        layout: {},
        warnings: null,
        page: 1,
        numPages: 2,
        ...data
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

export const mockError = (detail: string, error: string =  "OTHER_ERROR"): ErrorDetail => {
    return {error: error, detail: detail};
};

export const mockAxios = new MockAdapter(axios);
