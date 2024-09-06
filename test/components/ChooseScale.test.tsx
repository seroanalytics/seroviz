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
import ChooseScale from "../../src/components/ChooseScale";
import {userEvent} from "@testing-library/user-event";

describe("<ChooseScale />", () => {

    test("can change scale", async () => {
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
                    <ChooseScale/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>);

        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.value).toBe("natural");
        expect(select.item(1)!!.value).toBe("log");
        expect(select.item(2)!!.value).toBe("log2");
        await userEvent.selectOptions(select, "log");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SELECT_SCALE,
            payload: "log"
        });
    });
});
