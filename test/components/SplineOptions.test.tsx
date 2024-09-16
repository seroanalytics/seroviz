import React from "react";
import {render, screen} from "@testing-library/react";
import {
    mockAppState,
    mockDatasetSettings
} from "../mocks";
import {
    RootDispatchContext,
    RootContext,
    ActionType
} from "../../src/RootContext";
import {userEvent} from "@testing-library/user-event";
import SplineOptions from "../../src/components/SplineOptions";

describe("<SplineOptions />", () => {

    test("can change method", async () => {
        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <SplineOptions/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const select = screen.getByRole("listbox") as HTMLSelectElement;
        expect(select.value).toBe("auto");
        expect(select.item(1)!!.value).toBe("gam");
        expect(select.item(2)!!.value).toBe("loess");
        await userEvent.selectOptions(select, "gam");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_SPLINE_OPTIONS,
            payload: {method: "gam"}
        });
    });

    test("can change span", async () => {
        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <SplineOptions/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const span = screen.getAllByRole("spinbutton")[0] as HTMLInputElement;
        expect(span.value).toBe("0.75");

        await userEvent.clear(span);

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_SPLINE_OPTIONS,
            payload: {span: 0}
        });
    });

    test("can change k", async () => {
        const dispatch = jest.fn();
        const state = mockAppState({
            selectedDataset: "d1",
            datasetSettings: {
                "d1": mockDatasetSettings()
            }
        });
        render(
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <SplineOptions/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const k = screen.getAllByRole("spinbutton")[1] as HTMLSelectElement;
        expect(k.value).toBe("10");
        await userEvent.clear(k);

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_SPLINE_OPTIONS,
            payload: {k: 5}
        });
    });
});
