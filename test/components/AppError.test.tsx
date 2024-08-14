import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import AppError from "../../src/components/AppError";
import {mockAppState, mockError} from "../mocks";
import {ActionType, RootContext, RootDispatchContext} from "../../src/RootContext";

describe("<AppError />", () => {

    test("should be null if no error present", () => {
        const state = mockAppState();
        const dispatch = jest.fn();
        const {container} = render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><AppError/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);
        expect(container.firstChild).toBe(null);
    });

    test("should display error detail if present", () => {
        const state = mockAppState({genericError: mockError("custom message")});
        const dispatch = jest.fn();
       render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><AppError/></RootDispatchContext.Provider>
        </RootContext.Provider>);
       const alert = screen.getByRole("alert");
       expect(alert.lastChild?.textContent).toBe("custom message");
    });

    test("should display error type if no detail present", () => {
        const state = mockAppState({genericError: mockError(null as any)});
        const dispatch = jest.fn();
        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><AppError/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);
        const alert = screen.getByRole("alert");
        expect(alert.lastChild?.textContent).toBe("API returned an error: OTHER_ERROR");
    });

    test("should dispatch ERROR_DISMISSED action when closed", () => {
        const state = mockAppState({genericError: mockError("custom message")});
        const dispatch = jest.fn();
        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><AppError/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);
        const closeButton = screen.getByRole("close");
        fireEvent.click(closeButton);
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.ERROR_DISMISSED);
    });
});
