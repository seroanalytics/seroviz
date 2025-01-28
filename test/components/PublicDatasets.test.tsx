import {render, screen, waitFor} from "@testing-library/react";
import PublicDatasets from "../../src/components/PublicDatasets";
import {mockAppState, mockAxios, mockSuccess} from "../mocks";
import {
    ActionType,
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import {MemoryRouter} from "react-router";
import {AppState} from "../../src/types";
(global as any).apiUrl = "api"

describe("<PublicDatatsets/>", () => {
    const state = mockAppState({
        publicDatasets: [
            {
                name: "d1",
                description: "some description with a <a href='whatever'>link</a>"
            },
            {
                name: "d2",
                description: "desc2"
            }
        ]
    });

    beforeEach(() => {
        mockAxios.reset();
        mockAxios.onGet("api/public/datasets/")
            .reply(200, mockSuccess([]));
    });

    function renderComponent(state: AppState, dispatch: any) {
        return render(<MemoryRouter>
            <RootContext.Provider value={state}>
                <RootDispatchContext.Provider value={dispatch}>
                    <PublicDatasets/>
                </RootDispatchContext.Provider>
            </RootContext.Provider>
        </MemoryRouter>);
    }

    it("renders list", () => {
        const dispatch = jest.fn();
        renderComponent(state, dispatch);
        expect(screen.getAllByRole("listitem").length).toBe(2);
    });

    it("fetches datasets", async () => {
        const dispatch = jest.fn();
        renderComponent(state, dispatch);

        await waitFor(() => dispatch.mock.calls.length > 1)

        expect(dispatch.mock.calls[1][0]).toEqual({
            type: ActionType.PUBLIC_DATASETS_FETCHED,
            payload: []
        })
    });

    it("user can select dataset", () => {
        renderComponent(state, jest.fn());
        const link = screen.getAllByRole<HTMLLinkElement>("link")[0];
        expect(link.href).toBe("http://localhost/dataset/public/d1");
    });

    it("use can download csv", () => {
        renderComponent(state, jest.fn());
        const link = screen.getAllByRole<HTMLLinkElement>("link")[1];
        expect(link.href).toBe("http://localhost/api/public/dataset/d1");
    });
});
