import {
    mockAppState,
    mockAxios,
    mockDatasetMetadata,
    mockDatasetSettings,
    mockSelectedCovariate,
    mockSeriesData,
    mockSuccess
} from "../mocks";
import {render, screen, waitFor} from "@testing-library/react";
import {RootContext} from "../../src/RootContext";
import {ExploreDataset} from "../../src/components/ExploreDataset";

// mock the react-plotly.js library
jest.mock("react-plotly.js", () => ({
    __esModule: true,
    default: jest.fn(() => "PLOT"),
}));

describe("<ExploreDataset/>", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    describe("no facet variables selected", () => {

        test("it renders sidebar and one plot per biomarker", async () => {
            mockAxios.onGet()
                .reply(200, mockSuccess(mockSeriesData()));

            const state = mockAppState({
                selectedDataset: "d1",
                datasetSettings: {"d1": mockDatasetSettings()},
                datasetMetadata: mockDatasetMetadata({
                    biomarkers: ["ab", "ba"]
                })
            });
            render(<RootContext.Provider value={state}>
                <ExploreDataset/>
            </RootContext.Provider>);

            await waitFor(() =>  expect(screen.getAllByText("PLOT").length).toBe(2));
            expect(screen.getAllByTestId("sidebar").length).toBe(1);
            expect(screen.getAllByText("PLOT").length).toBe(2);
        });
    });

    describe("facet variables selected", () => {

        test("it renders sidebar and multiple facets per biomarker",
            async () => {
                mockAxios.onGet()
                    .reply(200, mockSuccess(mockSeriesData()));

                const state = mockAppState({
                    datasetMetadata: mockDatasetMetadata({
                        biomarkers: ["ab", "ba"]
                    }),
                    selectedDataset: "d1",
                    datasetSettings: {
                        "d1": mockDatasetSettings({
                            covariateSettings: [
                                mockSelectedCovariate({
                                    display: "facet",
                                    name: "age",
                                    levels: ["0-5", "5+"]
                                }),
                                mockSelectedCovariate({
                                    name: "sex",
                                    display: "trace"
                                })
                            ]
                        })
                    }
                });
                render(<RootContext.Provider value={state}>
                    <ExploreDataset/>
                </RootContext.Provider>);

                await waitFor(() =>  expect(screen.getAllByText("PLOT").length).toBe(4));
                expect(screen.getAllByTestId("sidebar").length).toBe(1);
                expect(screen.getAllByText("PLOT").length).toBe(4);
            });
    });
});