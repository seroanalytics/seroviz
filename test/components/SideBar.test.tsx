import {render, screen} from "@testing-library/react";
import SideBar from "../../src/components/SideBar";
import {
    mockAppState,
    mockDatasetMetadata, mockDatasetSettings,
    mockSelectedCovariate,
    mockVariable
} from "../mocks";
import {
    ActionType,
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import {userEvent} from "@testing-library/user-event";

describe("<SideBar />", () => {
    test("it renders detected biomarkers and series type", () => {
        const state = mockAppState({
            datasetMetadata: mockDatasetMetadata({
                biomarkers: ["ab", "ba"]
            }),
            selectedDataset: "d1",
            datasetSettings: {"d1": mockDatasetSettings()}
        });
        const {container} = render(<RootContext.Provider value={state}>
            <SideBar></SideBar>
        </RootContext.Provider>);

        expect(container.textContent).toContain("Detected biomarkers ab, ba");
        expect(container.textContent).toContain("Time series type surveillance");
    });

    test("user can change dataset", async () => {
        const state = mockAppState({
            datasetNames: ["d1", "d2"],
            selectedDataset: "d1",
            datasetSettings: {"d1": mockDatasetSettings()}
        });
        const dispatch = jest.fn();
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <SideBar></SideBar>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const selectDataset = screen.getAllByRole("combobox")[0] as HTMLSelectElement;
        await userEvent.selectOptions(selectDataset, "d2");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.DATASET_SELECTED,
            payload: "d2"
        });
    });

    test("user can change plot", async () => {
        const state = mockAppState({
            datasetNames: ["d1", "d2"],
            selectedDataset: "d1",
            selectedPlot: "population",
            datasetSettings: {"d1": mockDatasetSettings()}
        });
        const dispatch = jest.fn();
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <SideBar></SideBar>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const selectPlot = screen.getAllByRole("combobox")[1] as HTMLSelectElement;
        await userEvent.selectOptions(selectPlot, "individual");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.PLOT_SELECTED,
            payload: "individual"
        });
    });

    describe("selectedPlot == 'population'", () => {
        test("it renders CovariateOptions with available covariates", () => {
            const state = mockAppState({
                datasetMetadata: mockDatasetMetadata({
                    variables: [
                        mockVariable({name: "a"}),
                        mockVariable({name: "b"}),
                        mockVariable({name: "c"}),
                    ]
                }),
                selectedDataset: "d1",
                datasetSettings: {
                    "d1": mockDatasetSettings({
                        covariateSettings: [
                            mockSelectedCovariate({name: "a"})
                        ]
                    })
                }
            });
            const {container} = render(<RootContext.Provider value={state}>
                <SideBar></SideBar>
            </RootContext.Provider>);

            const selectVariable = screen.getAllByRole("listbox")[1] as HTMLSelectElement;
            let items = selectVariable.options;
            expect(items.length).toBe(2);
            expect(items[0].value).toBe("b");
            expect(items[1].value).toBe("c");
            expect(container.textContent).toContain("Disaggregate by");
        });

        test("it does not render disaggregation section if no available covariates", () => {
            const state = mockAppState({
                datasetMetadata: mockDatasetMetadata({
                    variables: []
                }),
                selectedDataset: "d1",
                datasetSettings: {"d1": mockDatasetSettings()}
            });
            const {container} = render(<RootContext.Provider value={state}>
                <SideBar></SideBar>
            </RootContext.Provider>);

            expect(container.textContent).not.toContain("Disaggregate by");
        });

        test("user can change spline settings", async () => {
            const state = mockAppState({
                datasetNames: ["d1", "d2"],
                selectedDataset: "d1",
                datasetSettings: {"d1": mockDatasetSettings()}
            });
            const dispatch = jest.fn();
            const {container} = render(
                <RootContext.Provider value={state}>
                    <RootDispatchContext.Provider value={dispatch}>
                        <SideBar></SideBar>
                    </RootDispatchContext.Provider>
                </RootContext.Provider>);

            expect(container.textContent).toContain("Spline options")
        });
    });

    describe("selectedPlot == 'individual'", () => {
        test("user can change individual settings", async () => {
            const state = mockAppState({
                datasetNames: ["d1", "d2"],
                selectedDataset: "d1",
                selectedPlot: "individual",
                datasetSettings: {"d1": mockDatasetSettings()}
            });
            const dispatch = jest.fn();
            const {container} = render(
                <RootContext.Provider value={state}>
                    <RootDispatchContext.Provider value={dispatch}>
                        <SideBar></SideBar>
                    </RootDispatchContext.Provider>
                </RootContext.Provider>);

            expect(container.textContent).toContain("Id column")
        });
    });

});
