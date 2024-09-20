import {
    mockAppState, mockAxios,
    mockDatasetMetadata,
    mockDatasetSettings, mockFailure,
    mockIndividualSettings, mockPlotlyData, mockSuccess
} from "../mocks";
import {render, waitFor, screen} from "@testing-library/react";
import {RootContext} from "../../src/RootContext";
import {IndividualPlots} from "../../src/components/IndividualPlots";

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
        const {container, rerender} = render(<RootContext.Provider
            value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        expect(container.textContent).toContain("Please select an id column");
        state.datasetSettings[state.selectedDataset].individualSettings.pid = "pid";

        rerender(<RootContext.Provider value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        expect(container.textContent).not.toContain("Please select an id column");
    });

    test("fetches data id id col selected", async () => {

        mockAxios.onGet()
            .reply(200, mockSuccess(mockPlotlyData()));

        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings({
                    individualSettings: mockIndividualSettings({
                        pid: "pid"
                    })
                })
            },
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            })
        });
        render(<RootContext.Provider value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));
        expect(mockAxios.history.get.length).toBe(1);
    });

    test("displays single warning", async () => {
        mockAxios.onGet()
            .reply(200, mockSuccess(mockPlotlyData({
                warnings: "a warning"
            })));

        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings({
                    individualSettings: mockIndividualSettings({
                        pid: "pid"
                    })
                })
            },
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            })
        });
        const {rerender} = render(<RootContext.Provider value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        expect(screen.getByRole("alert").textContent)
            .toBe("Plot generated some warnings:a warning");

        mockAxios.onGet()
            .reply(200, mockSuccess(mockPlotlyData({
                warnings: null
            })));

        state.datasetSettings[state.selectedDataset].scale = "log";
        rerender(<RootContext.Provider value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        await waitFor(() => expect(screen.queryAllByRole("alert").length)
            .toBe(0));
    });

    test("displays array of warnings", async () => {
        mockAxios.onGet()
            .reply(200, mockSuccess(mockPlotlyData({
                warnings: ["a warning", "another warning"]
            })));

        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings({
                    individualSettings: mockIndividualSettings({
                        pid: "pid"
                    })
                })
            },
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            })
        });
        render(<RootContext.Provider value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        expect(screen.getByRole("alert").textContent)
            .toBe("Plot generated some warnings:a warninganother warning");
    });

    test("displays errors", async () => {
        mockAxios.onGet()
            .reply(400, mockFailure("an error occurred"));

        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings({
                    individualSettings: mockIndividualSettings({
                        pid: "pid"
                    })
                })
            },
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            })
        });
        render(<RootContext.Provider value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        const alert = screen.getByRole("alert");
        expect(alert).toHaveClass("alert-danger");
        expect(alert.textContent)
            .toBe("Plot of individual trajectories could not be generated due to the following error:an error occurred ");
    });

    test("handles single point traces", async () => {
        mockAxios.onGet()
            .reply(200, mockSuccess(mockPlotlyData({
                data: [
                    {
                        x: 1,
                        y: 1
                    }
                ]
            })));

        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings({
                    individualSettings: mockIndividualSettings({
                        pid: "pid"
                    })
                })
            },
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            })
        });
        render(<RootContext.Provider value={state}>
            <IndividualPlots/>
        </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

    });
});
