import React from "react";
import {render, screen} from "@testing-library/react";
import {mockError} from "../mocks";
import {RootDispatchContext} from "../../src/RootContext";
import PlotError from "../../src/components/PlotError";

describe("<PlotError />", () => {

    test("should display error detail if present", () => {
        const error = mockError("custom message");
        const dispatch = jest.fn();
        render(<RootDispatchContext.Provider value={dispatch}>
            <PlotError title={"nice-plot"} error={error}/>
        </RootDispatchContext.Provider>);
        const alert = screen.getByRole("alert");
        expect(alert.textContent)
            .toBe("Plot of nice-plot could not be generated due to the following error:custom message ");
    });

    test("should display error type if no detail present", () => {
        const error = mockError(null as any);
        const dispatch = jest.fn();
        render(<RootDispatchContext.Provider value={dispatch}>
            <PlotError title={"nice-plot"} error={error}/>
        </RootDispatchContext.Provider>);
        const alert = screen.getByRole("alert");
        expect(alert.textContent)
            .toBe("Plot of nice-plot could not be generated due to the following error:API returned an error: OTHER_ERROR ");
    });

    test("should display home link if type is SESSION_EXPIRED", () => {
        const error = mockError("Session expired.", "SESSION_EXPIRED");
        const dispatch = jest.fn();
        render(<RootDispatchContext.Provider value={dispatch}>
            <PlotError title={"nice-plot"} error={error}/>
        </RootDispatchContext.Provider>);
        const alert = screen.getByRole("alert");
        expect(alert.textContent)
            .toBe("Plot of nice-plot could not be generated due to the following error:Session expired. Re-upload your data to continue.");
        const link = screen.getByRole("link") as HTMLAnchorElement;
        expect(link.href).toBe("http://localhost/");
    });
});
