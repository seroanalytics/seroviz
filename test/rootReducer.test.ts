import {mockAppState, mockCovariate, mockDatasetMetadata, mockDatasetNames, mockError} from "./mocks";
import {ActionType, rootReducer} from "../src/RootContext";

describe("rootReducer", () => {

    it("should add generic error on ERROR_ADDED", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {type: ActionType.ERROR_ADDED, payload: mockError("custom message")});
        expect(newState.genericError).toEqual(mockError("custom message"));
    });

    it("should dismiss generic error on ERROR_DISMISSED", () => {
        const state = mockAppState({genericError: mockError("custom message")});
        const newState = rootReducer(state,
            {type: ActionType.ERROR_DISMISSED, payload: null});
        expect(newState.genericError).toBe(null);
    });

    it("should add upload error on UPLOAD_ERROR_ADDED", () => {
        const state = mockAppState({uploadError: null});
        const newState = rootReducer(state,
            {type: ActionType.UPLOAD_ERROR_ADDED, payload: mockError("custom message")});
        expect(newState.uploadError).toEqual(mockError("custom message"));
    });

    it("should dismiss upload error on UPLOAD_ERROR_DISMISSED", () => {
        const state = mockAppState({uploadError: mockError("custom message")});
        const newState = rootReducer(state,
            {type: ActionType.UPLOAD_ERROR_DISMISSED, payload: null});
        expect(newState.uploadError).toBe(null);
    });

    it("should add datasets on DATASET_NAMES_FETCHED", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {type: ActionType.DATASET_NAMES_FETCHED, payload: mockDatasetNames()});
        expect(newState.datasetNames).toEqual(mockDatasetNames());
    });

    it("should add dataset metadata on DATASET_METADATA_FETCHED", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {type: ActionType.DATASET_METADATA_FETCHED, payload: mockDatasetMetadata()});
        expect(newState.datasetMetadata).toEqual(mockDatasetMetadata());
    });

    it("should select dataset on DATASET_SELECTED", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {type: ActionType.DATASET_SELECTED, payload: "d1"});
        expect(newState.selectedDataset).toBe("d1");
    });

    it("should add covariate on SELECT_COVARIATE", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {type: ActionType.SELECT_COVARIATE, payload: mockCovariate({name: "c1"})});
        expect(newState.selectedCovariates.length).toBe(1);
        expect(newState.selectedCovariates[0]).toEqual(mockCovariate({name: "c1"}));
    });

    it("should remove covariate on UNSELECT_COVARIATE", () => {
        const state = mockAppState({
            selectedCovariates: [mockCovariate({name: "c1"})]
        });
        const newState = rootReducer(state,
            {type: ActionType.UNSELECT_COVARIATE, payload: "c1"});
        expect(newState.selectedCovariates.length).toBe(0);
    });
});
