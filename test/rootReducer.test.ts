import {
    mockAppState,
    mockCovariate,
    mockDatasetMetadata,
    mockDatasetNames, mockDatasetSettings,
    mockError
} from "./mocks";
import {ActionType, initialState} from "../src/RootContext";
import {rootReducer} from "../src/reducers/rootReducer";

describe("rootReducer", () => {

    it("should add generic error on ERROR_ADDED", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {
                type: ActionType.ERROR_ADDED,
                payload: mockError("custom message")
            });
        expect(newState.genericErrors).toEqual([mockError("custom message")]);
    });

    it("should dismiss generic error on ERROR_DISMISSED", () => {
        const state = mockAppState({
            genericErrors: [
                mockError("custom message"),
                mockError("another message")]
        });
        const newState = rootReducer(state,
            {
                type: ActionType.ERROR_DISMISSED,
                payload: mockError("custom message")
            });
        expect(newState.genericErrors).toEqual([mockError("another message")]);
    });

    it("should add upload error on UPLOAD_ERROR_ADDED", () => {
        const state = mockAppState({uploadError: null});
        const newState = rootReducer(state,
            {
                type: ActionType.UPLOAD_ERROR_ADDED,
                payload: mockError("custom message")
            });
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
            {
                type: ActionType.DATASET_NAMES_FETCHED,
                payload: mockDatasetNames()
            });
        expect(newState.datasetNames).toEqual(mockDatasetNames());
    });

    it("should add dataset metadata on DATASET_METADATA_FETCHED", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {
                type: ActionType.DATASET_METADATA_FETCHED,
                payload: mockDatasetMetadata()
            });
        expect(newState.datasetMetadata).toEqual(mockDatasetMetadata());
    });

    it("should select dataset and add key to dataset settings on DATASET_SELECTED", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {
                type: ActionType.DATASET_SELECTED,
                payload: {dataset: "d1", public: true}
            });
        expect(newState.selectedDataset).toBe("d1");
        expect(newState.datasetSettings["d1"].covariateSettings).toEqual([]);
        expect(newState.datasetSettings["d1"].scale).toEqual("natural");
        expect(newState.selectedDatasetIsPublic).toBe(true);
    });

    it("should add public datasets", () => {
        const state = mockAppState();
        const newState = rootReducer(state,
            {
                type: ActionType.PUBLIC_DATASETS_FETCHED,
                payload: [{name: "d1", description: "desc 1"}]
            });
        expect(newState.publicDatasets).toEqual([{
            name: "d1",
            description: "desc 1"
        }])
    })

    it("should add covariate on SELECT_COVARIATE", () => {
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {"d1": mockDatasetSettings()}
        });
        const newState = rootReducer(state,
            {
                type: ActionType.SELECT_COVARIATE,
                payload: mockCovariate({name: "c1"})
            });
        expect(newState.datasetSettings["d1"].covariateSettings.length).toBe(1);
        expect(newState.datasetSettings["d1"].covariateSettings[0]).toEqual(mockCovariate({name: "c1"}));
    });

    it("should remove covariate on UNSELECT_COVARIATE", () => {
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings({
                    covariateSettings: [mockCovariate({name: "c1"})]
                })
            }
        });
        const newState = rootReducer(state,
            {type: ActionType.UNSELECT_COVARIATE, payload: "c1"});
        expect(newState.datasetSettings["d1"].covariateSettings.length).toBe(0);
    });

    it("should select scale on SELECT_SCALE", () => {
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        expect(state.datasetSettings["d1"].scale).toBe("natural");
        const newState = rootReducer(state,
            {type: ActionType.SELECT_SCALE, payload: "log"});
        expect(newState.datasetSettings["d1"].scale).toBe("log");
    });

    it("should clear all errors on CLEAR_ALL_ERRORS", () => {
        const state = mockAppState({
            genericErrors: [mockError("1"), mockError("2")]
        });
        const newState = rootReducer(state,
            {type: ActionType.CLEAR_ALL_ERRORS, payload: null});
        expect(newState.genericErrors.length).toBe(0);
    });

    it("should set spline options on SET_SPLINE_OPTIONS", () => {
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        let newState = rootReducer(state,
            {type: ActionType.SET_SPLINE_OPTIONS, payload: {method: "gam"}});
        expect(newState.datasetSettings["d1"].splineSettings.method).toBe("gam");

        newState = rootReducer(state,
            {type: ActionType.SET_SPLINE_OPTIONS, payload: {span: 0.1}});
        expect(newState.datasetSettings["d1"].splineSettings.span).toBe(0.1);

        newState = rootReducer(state,
            {type: ActionType.SET_SPLINE_OPTIONS, payload: {k: 30}});
        expect(newState.datasetSettings["d1"].splineSettings.k).toBe(30);
    });

    it("should set individual options on SET_INDIVIDUAL_OPTIONS", () => {
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        let newState = rootReducer(state,
            {type: ActionType.SET_INDIVIDUAL_OPTIONS, payload: {pid: "id"}});
        expect(newState.datasetSettings["d1"].individualSettings.pid).toBe("id");

        newState = rootReducer(state,
            {
                type: ActionType.SET_INDIVIDUAL_OPTIONS,
                payload: {linetype: "sex"}
            });
        expect(newState.datasetSettings["d1"].individualSettings.linetype).toBe("sex");

        newState = rootReducer(state,
            {type: ActionType.SET_INDIVIDUAL_OPTIONS, payload: {color: "age"}});
        expect(newState.datasetSettings["d1"].individualSettings.color).toBe("age");

        newState = rootReducer(state,
            {
                type: ActionType.SET_INDIVIDUAL_OPTIONS,
                payload: {filter: "sex:F"}
            });
        expect(newState.datasetSettings["d1"].individualSettings.filter).toBe("sex:F");

        expect(newState.datasetSettings["d1"].individualSettings).toEqual({
            pid: "id",
            color: "age",
            filter: "sex:F",
            linetype: "sex"
        })
    });

    it("should select plot on PLOT_SELECTED", () => {
        const state = mockAppState();
        expect(state.selectedPlot).toBe("population");
        const newState = rootReducer(state,
            {type: ActionType.PLOT_SELECTED, payload: "individual"});
        expect(newState.selectedPlot).toBe("individual");
    });

    it("should delete dataset on DATASET_DELETED", () => {
        const state = mockAppState({
            datasetNames: ["d1", "d2"]
        });
        const newState = rootReducer(state,
            {type: ActionType.DATASET_DELETED, payload: "d1"});
        expect(newState.datasetNames).toEqual(["d2"]);
    });

    it("should revert to initial state on SESSION_DELETED", () => {
        const state = mockAppState({
            datasetNames: ["d1", "d2"],
            selectedDataset: "d1",
            selectedPlot: "individual"
        });
        const newState = rootReducer(state,
            {type: ActionType.SESSION_ENDED, payload: null});
        expect(newState).toEqual(initialState);
    });
});
