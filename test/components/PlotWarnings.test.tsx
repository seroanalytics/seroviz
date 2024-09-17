import React from "react";
import {render, screen} from "@testing-library/react";
import {RootDispatchContext} from "../../src/RootContext";
import PlotWarnings from "../../src/components/PlotWarnings";

describe("<PlotError />", () => {

    test("should display warnings for each trace", () => {
        const warnings = {
            "trace1": ["warning", "another warning"],
            "trace2": ["something bad"]
        }
        const dispatch = jest.fn();
        render(<RootDispatchContext.Provider value={dispatch}>
            <PlotWarnings warnings={warnings}/>
        </RootDispatchContext.Provider>);
        const alert = screen.getByRole("alert");
        expect(alert).toHaveClass("alert-warning");
        const lists = screen.getAllByRole("list");
        const firstTrace = lists[0] as HTMLUListElement;
        expect(firstTrace.textContent).toBe("warninganother warning");

        const secondTrace = lists[1] as HTMLUListElement;
        expect(secondTrace.textContent).toBe("something bad");
    });

    test("should return null if no warnings", () => {
        const dispatch = jest.fn();
        const {container} = render(<RootDispatchContext.Provider value={dispatch}>
            <PlotWarnings warnings={{}}/>
        </RootDispatchContext.Provider>);
       expect(container).toBeEmptyDOMElement();
    });
});
