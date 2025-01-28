import {
    mockAppState, mockAxios,
    mockDatasetMetadata,
    mockDatasetSettings, mockFailure,
    mockIndividualSettings, mockPlotlyData, mockSuccess
} from "../mocks";
import {render, waitFor, screen} from "@testing-library/react";
import {RootContext} from "../../src/RootContext";
import {IndividualPlots} from "../../src/components/IndividualPlots";
import {userEvent} from "@testing-library/user-event";

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

    test("fetches data if id col selected", async () => {

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

    test("fetches public data if dataset is public", async () => {

        mockAxios.onGet("/dataset/d1/individual/pid/?color=&linetype=biomarker&page=1&scale=natural&public=TRUE")
            .reply(200, mockSuccess(mockPlotlyData()));

        const state = mockAppState({
            selectedPlot: "individual",
            selectedDataset: "d1",
            selectedDatasetIsPublic: true,
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
        expect(mockAxios.history.get[0].url).toBe("/dataset/d1/individual/pid/?color=&linetype=biomarker&page=1&scale=natural&public=TRUE");
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

        const alert = screen.getByRole("alert");
        expect(alert).toHaveClass("alert-warning");
        expect(alert.textContent)
            .toBe("Plot generated some warnings:1 trace contained single data points and was omitted.");
    });

    test("can select page", async () => {
        mockAxios.onGet()
            .reply(200, mockSuccess(mockPlotlyData({
                data: [
                    {
                        x: [1, 2],
                        y: [3, 4]
                    }
                ],
                numPages: 3,
                page: 1
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

        let pagination = screen.getAllByRole("listitem");
        expect(pagination.length).toBe(3);

        expect(pagination[0]).toHaveClass("active");
        expect(pagination[0].textContent).toBe("1(current)");
        expect(pagination[1]).not.toHaveClass("active");
        expect(pagination[1].textContent).toBe("2");
        expect(pagination[2]).not.toHaveClass("active");
        expect(pagination[2].textContent).toBe("3");

        const paginationButtons = screen.getAllByRole("button") as HTMLButtonElement[];
        expect(paginationButtons.length).toBe(2);

        expect(paginationButtons[0].textContent).toBe("2");

        await userEvent.click(paginationButtons[0]);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(2));

        expect(mockAxios.history.get[1].url).toContain("page=2");
        pagination = screen.getAllByRole("listitem");
        expect(pagination[0]).not.toHaveClass("active");
        expect(pagination[0].textContent).toBe("1");
        expect(pagination[1]).toHaveClass("active");
        expect(pagination[1].textContent).toBe("2(current)");
        expect(pagination[2]).not.toHaveClass("active");
        expect(pagination[2].textContent).toBe("3");
    });
});
