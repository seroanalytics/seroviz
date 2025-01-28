import {
    mockAppState,
    mockAxios, mockDatasetMetadata,
    mockDatasetSettings, mockFailure,
    mockSuccess
} from "../mocks";
import {render, screen, waitFor} from "@testing-library/react";
import {
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import React from "react";
import LinePlot from "../../src/components/LinePlot";
import {DataSeries} from "../../src/generated";
import Plot from "react-plotly.js";
import Mock = jest.Mock;

// mock the react-plotly.js library
jest.mock("react-plotly.js", () => ({
    __esModule: true,
    default: jest.fn(() => "PLOT"),
}));

describe("<LinePlot />", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("requests data for given biomarker", async () => {
        mockAxios.onGet(`/dataset/d1/trace/ab/?scale=natural&method=auto&span=0.75&k=10`)
            .reply(200, mockSuccess<DataSeries>([{
                name: "all",
                model: {
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                raw: {
                    x: [1, 2],
                    y: [3, 4]
                },
                warnings: null
            }]));

        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            datasetMetadata: mockDatasetMetadata(),
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <LinePlot biomarker={"ab"}
                              facetLevels={[]}
                              facetVariables={[]}/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        await waitFor(() => expect((Plot as Mock))
            .toBeCalledTimes(1));

        const plot = Plot as Mock
        expect(plot.mock.calls[0][0].data).toEqual([
                {
                    legendgroup: "all",
                    line: {
                        shape: "spline",
                        width: 2
                    },
                    marker: {
                        color: "#1f77b4"
                    },
                    mode: "line",
                    name: "all",
                    showlegend: false,
                    type: "scatter",
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                {
                    legendgroup: "all",
                    marker: {
                        color: "#1f77b4",
                        opacity: 0.5
                    },
                    mode: "markers",
                    name: "all",
                    showlegend: false,
                    type: "scatter",
                    x: [1, 2],
                    y: [3, 4]
                }])
    });

    test("displays warnings", async () => {
        mockAxios.onGet(`/dataset/d1/trace/ab/?scale=natural&method=auto&span=0.75&k=10`)
            .reply(200, mockSuccess<DataSeries>([{
                name: "all",
                model: {
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                raw: {
                    x: [1, 2],
                    y: [3, 4]
                },
                warnings: ["test warning"]
            }]));

        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            datasetMetadata: mockDatasetMetadata(),
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <LinePlot biomarker={"ab"}
                              facetLevels={[]}
                              facetVariables={[]}/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        await waitFor(() => expect((Plot as Mock))
            .toBeCalledTimes(1));

        expect(screen.getByRole("alert")).toHaveClass("alert-warning");
        expect(screen.getByRole("alert").textContent)
            .toBe("Some traces generated warningsall:test warning")
    });

    test("requests data for given facet variables", async () => {
        mockAxios.onGet(`/dataset/d1/trace/ab/?filter=age%3A0%2Bsex%3AF&scale=natural&method=auto&span=0.75&k=10`)
            .reply(200, mockSuccess<DataSeries>([{
                name: "all",
                model: {
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                raw: {
                    x: [1, 2],
                    y: [3, 4]
                },
                warnings: null
            }]));

        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            datasetMetadata: mockDatasetMetadata(),
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <LinePlot biomarker={"ab"}
                              facetLevels={["0", "F"]}
                              facetVariables={["age", "sex"]}/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        await waitFor(() => expect((Plot as Mock))
            .toBeCalledTimes(1));

        const plot = Plot as Mock
        expect(plot.mock.calls[0][0].data).toEqual([
                {
                    legendgroup: "all",
                    line: {
                        shape: "spline",
                        width: 2
                    },
                    marker: {
                        color: "#1f77b4"
                    },
                    mode: "line",
                    name: "all",
                    showlegend: false,
                    type: "scatter",
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                {
                    legendgroup: "all",
                    marker: {
                        color: "#1f77b4",
                        opacity: 0.5
                    },
                    mode: "markers",
                    name: "all",
                    showlegend: false,
                    type: "scatter",
                    x: [1, 2],
                    y: [3, 4]
                }])
    });

    test("requests data for public dataset", async () => {
        mockAxios.onGet(`/dataset/d1/trace/ab/?filter=age%3A0%2Bsex%3AF&scale=natural&method=auto&span=0.75&k=10&public=TRUE`)
            .reply(200, mockSuccess<DataSeries>([{
                name: "all",
                model: {
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                raw: {
                    x: [1, 2],
                    y: [3, 4]
                },
                warnings: null
            }]));

        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            selectedDatasetIsPublic: true,
            datasetMetadata: mockDatasetMetadata(),
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <LinePlot biomarker={"ab"}
                              facetLevels={["0", "F"]}
                              facetVariables={["age", "sex"]}/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        await waitFor(() => expect((Plot as Mock))
            .toBeCalledTimes(1));

        const plot = Plot as Mock
        expect(plot.mock.calls[0][0].data).toEqual([
            {
                legendgroup: "all",
                line: {
                    shape: "spline",
                    width: 2
                },
                marker: {
                    color: "#1f77b4"
                },
                mode: "line",
                name: "all",
                showlegend: false,
                type: "scatter",
                x: [1.1, 2.2],
                y: [3.3, 4.4]
            },
            {
                legendgroup: "all",
                marker: {
                    color: "#1f77b4",
                    opacity: 0.5
                },
                mode: "markers",
                name: "all",
                showlegend: false,
                type: "scatter",
                x: [1, 2],
                y: [3, 4]
            }]);
    });

    test("clears plot and renders error if request to API fails", async () => {
        mockAxios.onGet("/dataset/d1/trace/ab/?scale=natural&method=auto&span=0.75&k=10")
            .reply(200, mockSuccess<DataSeries>([{
                name: "all",
                model: {
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                raw: {
                    x: [1, 2],
                    y: [3, 4]
                },
                warnings: null
            }]));

        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            datasetMetadata: mockDatasetMetadata(),
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        const {rerender} = render(<RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <LinePlot biomarker={"ab"}
                              facetLevels={[]}
                              facetVariables={[]}/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(1));

        expect(screen.getAllByText("PLOT").length).toBe(1);

        mockAxios.onGet("/dataset/d1/trace/ab/?filter=sex%3AF&scale=natural&method=auto&span=0.75&k=10")
            .reply(404, mockFailure("bad"));

        rerender(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider value={dispatch}>
                <LinePlot biomarker={"ab"}
                          facetLevels={["F"]}
                          facetVariables={["sex"]}/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        await waitFor(() => expect(mockAxios.history.get.length)
            .toBe(2));

        expect(screen.queryAllByText("PLOT").length).toBe(0);
        expect(screen.getByRole("alert").textContent)
            .toBe("Plot of sex:F could not be generated due to the following error:bad ");
    });

});
