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
import {
    ActionType,
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import ExploreDataset from "../../src/components/ExploreDataset";
import {MemoryRouter, Route, Routes} from "react-router-dom";

// mock the react-plotly.js library
jest.mock("react-plotly.js", () => ({
    __esModule: true,
    default: jest.fn(() => "PLOT"),
}));

describe("<ExploreDataset/>", () => {

    beforeEach(() => {
        mockAxios.reset();
        mockAxios.onGet("/datasets/")
            .reply(200, mockSuccess([]));
    });

    describe("selectedPlot == 'population'", () => {

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
                render(<MemoryRouter initialEntries={['/dataset/d1']}>
                    <RootContext.Provider value={state}>
                        <ExploreDataset isPublic={false}/>
                    </RootContext.Provider>
                </MemoryRouter>);

                await waitFor(() => expect(screen.getAllByText("PLOT").length).toBe(2));
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
                    render(<MemoryRouter
                        initialEntries={['/dataset/d1']}>
                        <RootContext.Provider
                            value={state}>
                            <ExploreDataset isPublic={false}/>
                        </RootContext.Provider></MemoryRouter>);

                    await waitFor(() => expect(screen.getAllByText("PLOT").length).toBe(4));
                    expect(screen.getAllByTestId("sidebar").length).toBe(1);
                    expect(screen.getAllByText("PLOT").length).toBe(4);
                });
        });
    });

    describe("selectedPlot == 'individual'", () => {
        test("it renders sidebar and message about selecting id col", async () => {
            mockAxios.onGet()
                .reply(200, mockSuccess(mockSeriesData()));
            const state = mockAppState({
                selectedPlot: "individual",
                selectedDataset: "d1",
                datasetSettings: {"d1": mockDatasetSettings()},
                datasetMetadata: mockDatasetMetadata({
                    biomarkers: ["ab", "ba"]
                })
            });
            const {container} = render(
                <MemoryRouter
                    initialEntries={['/dataset/d1']}>
                    <RootContext.Provider value={state}>
                        <ExploreDataset isPublic={false}/>
                    </RootContext.Provider>
                </MemoryRouter>);

            expect(container.textContent).toContain("Please select an id column");
        });
    });

    describe("/dataset/public/d1", () => {
        it("fetches public dataset", () => {
            mockAxios.onGet("/dataset/d1/?public=TRUE")
                .reply(200, mockSuccess(mockSeriesData()));
            const state = mockAppState()
            const dispatch = jest.fn();
            render(<RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <MemoryRouter initialEntries={["/dataset/public/d1"]}>
                        <Routes>
                            <Route path="/dataset/public/:name"
                                   element={<ExploreDataset isPublic={true}/>}/>
                        </Routes>
                    </MemoryRouter>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

            expect(dispatch.mock.calls[1][0]).toEqual({
                type: ActionType.DATASET_SELECTED,
                payload: {
                    dataset: "d1",
                    public: true
                }
            })
            expect(mockAxios.history.get[1].url).toEqual("/dataset/d1/?public=TRUE")
        })
    });
});