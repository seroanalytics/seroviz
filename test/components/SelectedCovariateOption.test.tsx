import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {mockSelectedCovariate, mockVariable} from "../mocks";
import {ActionType, RootDispatchContext} from "../../src/RootContext";
import SelectedCovariateOption
    from "../../src/components/SelectedCovariateOption";

describe("<SelectedCovariateOption />", () => {

    const covariate = mockSelectedCovariate({
        name: "age",
        levels: ["0-5", "5+"],
        display: "trace"
    });

    test("should display selected covariate details", () => {
        const dispatch = jest.fn();
        const {container} = render(
            <RootDispatchContext.Provider value={dispatch}>
                <SelectedCovariateOption covariate={covariate} key={"1"}/>
            </RootDispatchContext.Provider>);
        expect(container.textContent).toContain("age");
        expect(container.textContent).toContain("trace");
    });

    test("can remove selected covariate", async () => {
        const dispatch = jest.fn();
        render(
            <RootDispatchContext.Provider
                value={dispatch}><SelectedCovariateOption covariate={covariate}
                                                          key={"1"}/>
            </RootDispatchContext.Provider>);
        const closeButton = screen.getByRole("close");

        fireEvent.click(closeButton);

        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.UNSELECT_COVARIATE);
        expect(dispatch.mock.calls[0][0].payload).toEqual("age");
    });
});
