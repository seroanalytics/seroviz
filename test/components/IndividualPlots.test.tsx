import {
    mockAppState, mockAxios,
    mockDatasetMetadata,
    mockDatasetSettings,
    mockIndividualSettings, mockPlotlyData, mockSeriesData, mockSuccess
} from "../mocks";
import {render, waitFor} from "@testing-library/react";
import {RootContext} from "../../src/RootContext";
import ExploreDataset from "../../src/components/ExploreDataset";

describe("<IndividualPlots/>", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("message about selecting id col iff no id col selected", async () => {
        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            datasetSettings: {"d1": mockDatasetSettings()},
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            })
        });
        const {container, rerender} = render(<RootContext.Provider value={state}>
            <ExploreDataset/>
        </RootContext.Provider>);

        expect(container.textContent).toContain("Please select an id column");
        state.datasetSettings[state.selectedDataset].individualSettings.pid = "pid";

        rerender(<RootContext.Provider value={state}>
            <ExploreDataset/>
        </RootContext.Provider>);

        expect(container.textContent).not.toContain("Please select an id column");
    });

    test("fetches data id id col selected", async () => {

        mockAxios.onGet()
            .reply(200, mockSuccess(mockPlotlyData()));

        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            datasetSettings: {"d1": mockDatasetSettings({
                    individualSettings: mockIndividualSettings({
                        pid: "pid"
                    })
                })},
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            })
        });
        render(<RootContext.Provider value={state}>
            <ExploreDataset/>
        </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));
        expect(mockAxios.history.get.length).toBe(1);
    });

    // TODO test warnings
    // TODO test behaviour when a data series has a single point
    // TODO test errors
});
