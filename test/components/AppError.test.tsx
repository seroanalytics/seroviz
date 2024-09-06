import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import AppError from "../../src/components/AppError";
import {mockAppState, mockError} from "../mocks";
import {ActionType, RootContext, RootDispatchContext} from "../../src/RootContext";

describe("<AppError />", () => {

    test("should display error detail if present", () => {
       const error = mockError("custom message");
       const dispatch = jest.fn();
       render(<RootDispatchContext.Provider value={dispatch}>
                <AppError error={error}/>
       </RootDispatchContext.Provider>);
       const alert = screen.getByRole("alert");
       expect(alert.textContent).toBe("custom message ");
    });

    test("should display error type if no detail present", () => {
        const error = mockError(null as any);
        const dispatch = jest.fn();
        render(<RootDispatchContext.Provider value={dispatch}>
            <AppError error={error}/>
        </RootDispatchContext.Provider>);
        const alert = screen.getByRole("alert");
        expect(alert.textContent).toBe("API returned an error: OTHER_ERROR ");
    });

    test("should display home link if type is SESSION_EXPIRED", () => {
        const error = mockError("Session expired.", "SESSION_EXPIRED");
        const dispatch = jest.fn();
        render(<RootDispatchContext.Provider value={dispatch}>
            <AppError error={error}/>
        </RootDispatchContext.Provider>);
        const alert = screen.getByRole("alert");
        expect(alert.textContent).toBe("Session expired. Re-upload your data to continue.");
        const link = screen.getByRole("link") as HTMLAnchorElement;
        expect(link.href).toBe("http://localhost/");
    });

    test("should dispatch ERROR_DISMISSED action when closed", () => {
        const error = mockError("custom message");
        const dispatch = jest.fn();
        render(<RootDispatchContext.Provider value={dispatch}>
            <AppError error={error}/>
        </RootDispatchContext.Provider>);
        const closeButton = screen.getByRole("close");
        fireEvent.click(closeButton);
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.ERROR_DISMISSED);
        expect(dispatch.mock.calls[0][0].payload).toEqual(error);
    });
});
