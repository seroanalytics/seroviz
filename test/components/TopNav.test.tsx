import {mockAppState, mockAxios, mockSuccess} from "../mocks";
import {userEvent} from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import {
    ActionType,
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import TopNav from "../../src/components/TopNav";

test("user can end session", async () => {
    mockAxios.onDelete(`/session/`)
        .reply(200, mockSuccess("OK"));

    let state = mockAppState();
    const dispatch = jest.fn();
    const user = userEvent.setup();

    render(<RootContext.Provider value={state}>
        <RootDispatchContext.Provider
            value={dispatch}><TopNav theme={"light"} setTheme={jest.fn()}/>
        </RootDispatchContext.Provider>
    </RootContext.Provider>);

    const links = screen.getAllByRole("button") as HTMLAnchorElement[];
    const endSession = links.find(l => l.textContent === "End session")!!;
    await user.click(endSession);
    expect(dispatch.mock.calls[1][0].type).toBe(ActionType.SESSION_ENDED);
});
