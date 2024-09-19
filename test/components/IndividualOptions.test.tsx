import {
    mockAppState,
    mockDatasetMetadata,
    mockDatasetSettings,
    mockVariable
} from "../mocks";
import {render, screen} from "@testing-library/react";
import {
    ActionType,
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import {userEvent} from "@testing-library/user-event";
import React from "react";
import IndividualOptions from "../../src/components/IndividualOptions";

describe("<IndividualOptions />", () => {

    test("can change id column", async () => {
        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            selectedPlot: "individual",
            datasetSettings: {
                "d1": mockDatasetSettings()
            },
            datasetMetadata: mockDatasetMetadata({
                variables: [
                    mockVariable({name: "id", levels: [1, 2]}),
                    mockVariable({name: "pid", levels: [1, 2]})
                ]
            })
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <IndividualOptions/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const select = screen.getAllByRole("listbox")[0] as HTMLSelectElement;
        expect(select.value).toBe("");
        expect(select.item(1)!!.value).toBe("id");
        expect(select.item(2)!!.value).toBe("pid");
        expect(select.item(3)!!.value).toBe("biomarker");
        await userEvent.selectOptions(select, "id");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {pid: "id"}
        });
    });

    test("can change color", async () => {
        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            selectedPlot: "individual",
            datasetSettings: {
                "d1": mockDatasetSettings()
            },
            datasetMetadata: mockDatasetMetadata({
                variables: [
                    mockVariable({name: "pid", levels: [1, 2]}),
                    mockVariable({name: "sex", levels: [1, 2]})
                ]
            })
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <IndividualOptions/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const select = screen.getAllByRole("listbox")[1] as HTMLSelectElement;
        expect(select.value).toBe("");
        expect(select.item(1)!!.value).toBe("pid");
        expect(select.item(2)!!.value).toBe("sex");
        expect(select.item(3)!!.value).toBe("biomarker");
        await userEvent.selectOptions(select, "sex");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {color: "sex"}
        });
    });

    test("can change linetype", async () => {
        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            selectedPlot: "individual",
            datasetSettings: {
                "d1": mockDatasetSettings()
            },
            datasetMetadata: mockDatasetMetadata({
                variables: [
                    mockVariable({name: "pid", levels: [1, 2]}),
                    mockVariable({name: "sex", levels: [1, 2]})
                ]
            })
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <IndividualOptions/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const select = screen.getAllByRole("listbox")[2] as HTMLSelectElement;
        expect(select.value).toBe("biomarker");
        expect(select.item(1)!!.value).toBe("pid");
        expect(select.item(2)!!.value).toBe("sex");
        expect(select.item(3)!!.value).toBe("biomarker");
        await userEvent.selectOptions(select, "sex");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {linetype: "sex"}
        });
    });


    test("can change filter", async () => {
        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            selectedPlot: "individual",
            datasetSettings: {
                "d1": mockDatasetSettings()
            },
            datasetMetadata: mockDatasetMetadata({
                variables: [
                    mockVariable({name: "pid", levels: [1, 2]}),
                    mockVariable({name: "sex", levels: ["M", "F"]})
                ]
            })
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <IndividualOptions/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        expect(screen.getAllByRole("listbox").length).toBe(4);
        const select = screen.getAllByRole("listbox")[3] as HTMLSelectElement;
        expect(select.value).toBe("");
        expect(select.item(1)!!.value).toBe("pid");
        expect(select.item(2)!!.value).toBe("sex");
        expect(select.item(3)!!.value).toBe("biomarker");
        await userEvent.selectOptions(select, "sex");

        expect(dispatch.mock.calls.length).toBe(0);
        expect(screen.getAllByRole("listbox").length).toBe(5);
        const selectLevel = screen.getAllByRole("listbox")[4] as HTMLSelectElement;
        expect(selectLevel.value).toBe("");
        expect(selectLevel.item(1)!!.value).toBe("M");
        expect(selectLevel.item(2)!!.value).toBe("F");
        await userEvent.selectOptions(selectLevel, "M");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {filter: "sex:M"}
        });
    });
});
