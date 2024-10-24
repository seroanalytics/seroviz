import {ManageDatasets} from "../../src/components/ManageDatasets";
import {
    ActionType,
    RootContext,
    RootDispatchContext
} from "../../src/RootContext";
import {render, screen, waitFor} from "@testing-library/react";
import {mockAppState, mockAxios, mockSuccess} from "../mocks";
import {userEvent} from "@testing-library/user-event";

describe("<ManageDatasets/>", () => {

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
                value={dispatch}><ManageDatasets/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        await waitFor(() => expect(dispatch.mock.calls.length).toBe(2));

        expect(dispatch.mock.calls[1][0]).toEqual({
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
                value={dispatch}><ManageDatasets/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        const links = screen.getAllByRole("button") as HTMLAnchorElement[];
        expect(links[0].textContent).toBe("d1");
        expect(links[2].textContent).toBe("d2");
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
                value={dispatch}><ManageDatasets/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        expect(screen.queryAllByRole("button").length).toBe(1);
        expect(screen.getByRole("button").textContent).toBe("Upload");
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
                value={dispatch}><ManageDatasets/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        const links = screen.getAllByRole("button") as HTMLAnchorElement[];

        await user.click(links[2]);

        expect(dispatch.mock.calls[2][0]).toEqual({
            type: ActionType.DATASET_SELECTED,
            payload: "d2"
        });
    });

    test("user can delete dataset", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(["d1", "d2"]));

        mockAxios.onDelete(`/dataset/d1/`)
            .reply(200, mockSuccess("d1"));

        let state = mockAppState({
            datasetNames: ["d1", "d2"]
        });
        const dispatch = jest.fn();
        const user = userEvent.setup();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ManageDatasets/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        const links = screen.getAllByRole("button") as HTMLAnchorElement[];

        await user.click(links[1]);

        expect(dispatch.mock.calls[3][0]).toEqual({
            type: ActionType.DATASET_DELETED,
            payload: "d1"
        });
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
                value={dispatch}><ManageDatasets/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        const fileInput = screen.getByTestId("upload-file");
        const testFile = new File(['hello'], 'hello.csv', {type: 'text/csv'});
        await user.upload(fileInput, testFile);

        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.CLEAR_ALL_ERRORS);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.DATASET_NAMES_FETCHED);
        expect(dispatch.mock.calls[2][0].type).toBe(ActionType.UPLOAD_ERROR_DISMISSED);

        const upload = screen.getAllByRole("button")[4];
        expect(upload.textContent).toBe("Upload");
        await user.click(upload);
        expect(dispatch.mock.calls.length).toBe(7);
        expect(dispatch.mock.calls[3][0].type).toBe(ActionType.UPLOAD_ERROR_DISMISSED);
        expect(dispatch.mock.calls[4][0].type).toBe(ActionType.CLEAR_ALL_ERRORS);
        expect(dispatch.mock.calls[5][0].type).toBe(ActionType.CLEAR_ALL_ERRORS);
        expect(dispatch.mock.calls[6][0].type).toBe(ActionType.DATASET_NAMES_FETCHED);
    });

    test("dataset name must be null or alphanumeric", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(["d1", "d2"]));

        let state = mockAppState({
            datasetNames: ["d1", "d2"]
        });
        const dispatch = jest.fn();
        const user = userEvent.setup();

        render(<RootContext.Provider value={state}>
            <RootDispatchContext.Provider
                value={dispatch}><ManageDatasets/>
            </RootDispatchContext.Provider>
        </RootContext.Provider>);

        const datasetName = screen.getByTestId("dataset-name");
        await user.type(datasetName, "bad name");

        let upload = screen.getAllByRole("button")[4] as HTMLButtonElement;
        expect(upload.disabled).toBe(true);

        await user.clear(datasetName);

        upload = screen.getAllByRole("button")[4] as HTMLButtonElement;
        expect(upload.disabled).toBe(false);

        await user.type(datasetName, "good_name");

        upload = screen.getAllByRole("button")[4] as HTMLButtonElement;
        expect(upload.disabled).toBe(false);
    });
});
