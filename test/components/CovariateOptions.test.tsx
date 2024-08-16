import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {mockVariable} from "../mocks";
import {ActionType, RootDispatchContext} from "../../src/RootContext";
import CovariateOptions from "../../src/components/CovariateOptions";
import {userEvent} from "@testing-library/user-event";

describe("<CovariateOptions />", () => {

    const covariates = [
        mockVariable({name: "age", levels: ["0-5", "5+"]}),
        mockVariable({name: "sex", levels: ["M", "F"]})];

    test("should display form select with all available variables", () => {
        const dispatch = jest.fn();
        render(
            <RootDispatchContext.Provider value={dispatch}>
                <CovariateOptions covariates={covariates}/>
            </RootDispatchContext.Provider>);
        const select = screen.getAllByRole("listbox")[0] as HTMLSelectElement;
        const items = select.options;
        expect(select.name).toBe("variable");
        expect(items.length).toBe(2);

        expect((items[0] as HTMLOptionElement).value).toBe("age");
        expect((items[1] as HTMLOptionElement).value).toBe("sex");
    });

    test("should display form select with all available display options", () => {
        const dispatch = jest.fn();
        render(
            <RootDispatchContext.Provider
                value={dispatch}><CovariateOptions covariates={covariates}/>
            </RootDispatchContext.Provider>);
        const select = screen.getAllByRole("listbox")[1] as HTMLSelectElement;
        const items = select.options;
        expect(select.name).toBe("displayType");
        expect(items.length).toBe(2);

        expect((items[0] as HTMLOptionElement).value).toBe("trace");
        expect((items[1] as HTMLOptionElement).value).toBe("facet");
    });

    test("can add selected variable and display type", async () => {
        const dispatch = jest.fn();
        const user = userEvent.setup();

        render(
            <RootDispatchContext.Provider value={dispatch}>
                <CovariateOptions covariates={covariates}/>
            </RootDispatchContext.Provider>);
        const selectVariable = screen.getAllByRole("listbox")[0] as HTMLSelectElement;
        let items = selectVariable.options;
        await user.selectOptions(selectVariable, items[1].value);

        const selectDisplay = screen.getAllByRole("listbox")[1] as HTMLSelectElement;
        items = selectDisplay.options;
        await user.selectOptions(selectDisplay, items[1].value);

        const submit = screen.getByRole("button");
        fireEvent.click(submit);

        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.SELECT_COVARIATE);
        expect(dispatch.mock.calls[0][0].payload).toEqual({
            name: "sex",
            levels: ["M", "F"],
            display: "facet"
        });
    });
});
