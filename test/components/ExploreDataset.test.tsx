import {
    mockAppState,
    mockAxios,
    mockDatasetMetadata, mockSeriesData,
    mockSuccess
} from "../mocks";
import {render, screen} from "@testing-library/react";
import {RootContext} from "../../src/RootContext";
import {ExploreDataset} from "../../src/components/ExploreDataset";
import {act} from "react";

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
                datasetMetadata: mockDatasetMetadata({
                    biomarkers: ["ab", "ba"]
                })
            });
            await act(() => render(<RootContext.Provider value={state}>
                <ExploreDataset/>
            </RootContext.Provider>));

            expect(screen.getAllByTestId("sidebar").length).toBe(1);
            expect(screen.getAllByText("PLOT").length).toBe(2);
        })
    });
});