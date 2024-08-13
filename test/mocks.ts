import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {AppState, PorcelainError, ResponseFailure, ResponseSuccess} from "../src/types";

export function mockAppState(state: Partial<AppState> = {}): AppState {
    return {
        datasets: [],
        dataset: null,
        selectedDataset: "",
        selectedCovariates: [],
        uploadError: null,
        genericError: null,
        language: "en",
        ...state
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
