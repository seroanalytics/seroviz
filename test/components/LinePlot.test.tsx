import {
    mockAppState,
    mockAxios, mockDatasetMetadata,
    mockDatasetSettings,
    mockSuccess
} from "../mocks";
import {render, waitFor} from "@testing-library/react";
import {
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import React from "react";
import LinePlot from "../../src/components/LinePlot";
import {DataSeries} from "../../src/generated";
import Plot from "react-plotly.js";
import Mock = jest.Mock;

jest.mock("react-plotly.js", () => jest.fn());

describe("<LinePlot />", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("requests data for given biomarker", async () => {
        mockAxios.onGet(`/dataset/d1/trace/ab/?scale=natural`)
            .reply(200, mockSuccess<DataSeries>([{
                name: "all",
                model: {
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                raw: {
                    x: [1, 2],
                    y: [3, 4]
                }
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
            .toBeCalledTimes(2));

        const plot = Plot as Mock
        expect(plot.mock.calls[1][0]).toEqual({
            data: [
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
                }],
            layout: {
                legend: {
                    orientation: "v",
                    xanchor: "center"
                },
                paper_bgcolor: "rgba(255,255,255, 0)",
                title: "ab ",
                xaxis: {
                    title: {
                        text: "day"
                    }
                }
            },
            style: {
                height: "500",
                minWidth: "400px",
                width: "100%"
            },
            useResizeHandler: true
        })
    });

    test("requests data for given facet variables", async () => {
        mockAxios.onGet(`/dataset/d1/trace/ab/?filter=age%3A0%2Bsex%3AF&scale=natural`)
            .reply(200, mockSuccess<DataSeries>([{
                name: "all",
                model: {
                    x: [1.1, 2.2],
                    y: [3.3, 4.4]
                },
                raw: {
                    x: [1, 2],
                    y: [3, 4]
                }
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
            .toBeCalledTimes(2));

        const plot = Plot as Mock
        expect(plot.mock.calls[1][0].data).toEqual([
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
});