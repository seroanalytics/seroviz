import {ChooseOrUploadDataset} from "../../src/components/ChooseOrUploadDataset";
import {
    ActionType,
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import {render, screen, waitFor} from "@testing-library/react";
import {mockAppState, mockAxios, mockSuccess} from "../mocks";
import {userEvent} from "@testing-library/user-event";

describe("<ChooseOrUploadDataset/>", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("it fetches datasets on load", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(["d1", "d2"]));

        let state = mockAppState();
        const dispatch = jest.fn();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ChooseOrUploadDataset/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        await waitFor(() => expect(dispatch.mock.calls.length).toBe(1));

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.DATASET_NAMES_FETCHED,
            payload: ["d1", "d2"]
        });
    });

    test("it renders dataset names to choose from", () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(["d1", "d2"]));

        let state = mockAppState({
            datasetNames: ["d1", "d2"]
        });
        const dispatch = jest.fn();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ChooseOrUploadDataset/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        expect(screen.getAllByLabelText("Choose dataset").length).toBe(1);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.options.length).toBe(2);
        expect(select.options[0].value).toBe("d1");
        expect(select.options[1].value).toBe("d2");
    });

    test("it does not render select if no dataset names to choose from", () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess([]));

        let state = mockAppState({
            datasetNames: []
        });
        const dispatch = jest.fn();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ChooseOrUploadDataset/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        expect(screen.queryByLabelText("Choose dataset")).toBe(null);
        expect(screen.queryByText("Go")).toBe(null);
    });

    test("user can select dataset", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(["d1", "d2"]));

        let state = mockAppState({
            datasetNames: ["d1", "d2"]
        });
        const dispatch = jest.fn();
        const user = userEvent.setup();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ChooseOrUploadDataset/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        const select = screen.getByRole("combobox") as HTMLSelectElement;

        await user.selectOptions(select, "d2");
        const submit = screen.getByText("Go");
        await user.click(submit);

        expect(dispatch.mock.calls[1][0]).toEqual({
            type: ActionType.DATASET_SELECTED,
            payload: "d2"
        });
    });

    test("user can toggle advanced options", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(["d1", "d2"]));

        let state = mockAppState({
            datasetNames: ["d1", "d2"]
        });
        const dispatch = jest.fn();
        const user = userEvent.setup();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ChooseOrUploadDataset/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        expect(screen.getByTestId("advanced-options")).toHaveClass("d-none");
        const toggle = screen.getByText("Advanced options");
        await user.click(toggle);
        expect(screen.getByTestId("advanced-options")).toHaveClass("d-block");

        await user.click(toggle);
        expect(screen.getByTestId("advanced-options")).toHaveClass("d-none");
    });

    test("user can upload new file", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(["d1", "d2"]));

        mockAxios.onPost(`/dataset/`)
            .reply(200, mockSuccess("hello"));

        let state = mockAppState({
            datasetNames: ["d1", "d2"]
        });
        const dispatch = jest.fn();
        const user = userEvent.setup();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ChooseOrUploadDataset/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        const fileInput = screen.getByLabelText("Upload new dataset");
        const testFile = new File(['hello'], 'hello.csv', {type: 'text/csv'});
        await user.upload(fileInput, testFile);

        expect(dispatch.mock.calls.length).toBe(4);
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.DATASET_NAMES_FETCHED);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.UPLOAD_ERROR_DISMISSED);
        expect(dispatch.mock.calls[2][0].type).toBe(ActionType.DATASET_NAMES_FETCHED);
        expect(dispatch.mock.calls[3][0].type).toBe(ActionType.DATASET_SELECTED);
        expect(dispatch.mock.calls[3][0].payload).toBe("hello");
    });
});
