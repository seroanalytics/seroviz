import {mockAppState, mockAxios, mockError, mockFailure, mockSuccess} from "../mocks";
import {api} from "../../src/services/apiService";
import {ActionType, RootAction} from "../../src/RootContext";

const rootState = mockAppState();

describe("ApiService", () => {

    beforeEach(() => {
        console.log = jest.fn();
        console.warn = jest.fn();
        mockAxios.reset();
    });

    afterEach(() => {
        (console.log as jest.Mock).mockClear();
        (console.warn as jest.Mock).mockClear();
    });

    it("console logs error", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(500, mockFailure("some error message"));

        try {
            await api(rootState.language, jest.fn() as any)
                .get("/datasets/")
        } catch (e) {

        }
        expect((console.warn as jest.Mock).mock.calls[0][0])
            .toBe("No error handler registered for request /datasets/.");
        expect((console.log as jest.Mock).mock.calls[0][0].errors[0].detail)
            .toBe("some error message");
    });

    it("clears all before making a call", async () => {

        mockAxios.onGet(`/`)
            .reply(200, mockSuccess(true));

        mockAxios.onPost(`/`)
            .reply(200, mockSuccess(true));

        const dispatch = jest.fn();

        await api(rootState.language, dispatch as any)
            .get("/");

        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.CLEAR_ALL_ERRORS);

        await api(rootState.language, dispatch as any)
            .postAndReturn("/");

        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.CLEAR_ALL_ERRORS);
    });

    it("dispatches the the first error message by default", async () => {

        mockAxios.onGet(`/unusual/`)
            .reply(500, mockFailure("some error message"));

        const dispatch = jest.fn();

        await api(rootState.language, dispatch as any)
            .get("/unusual/");

        expect((console.warn as jest.Mock).mock.calls[0][0])
            .toBe("No error handler registered for request /unusual/.");

        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.ERROR_ADDED);
        expect(dispatch.mock.calls[1][0].payload).toStrictEqual(mockError("some error message"));
    });

    it("dispatches an extra SESSION_EXPIRED error on 404", async () => {

        mockAxios.onGet(`/bad/`)
            .reply(404, mockFailure("some error message"));

        const dispatch = jest.fn();

        await api(rootState.language, dispatch as any)
            .get("/bad/");

        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.ERROR_ADDED);
        expect(dispatch.mock.calls[1][0].payload).toStrictEqual(mockError("some error message"));
        expect(dispatch.mock.calls[2][0].type).toBe(ActionType.ERROR_ADDED);
        expect(dispatch.mock.calls[2][0].payload).toStrictEqual(mockError("Your session may have expired.", "SESSION_EXPIRED"))
    });

    it("if no first error message, dispatches a default error message to errors module by default", async () => {

        const failure = {
            data: {},
            status: "failure",
            errors: []
        };
        mockAxios.onGet(`/unusual/`)
            .reply(500, failure);

        const dispatch = jest.fn();

        await api(rootState.language, dispatch as any)
            .get("/unusual/");

        expect((console.warn as jest.Mock).mock.calls[0][0])
            .toBe("No error handler registered for request /unusual/.");

        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.ERROR_ADDED);
        expect(dispatch.mock.calls[1][0].payload).toStrictEqual({
            error: "MALFORMED_RESPONSE",
            detail: "API response failed but did not contain any error information. If error persists, please contact support.",
        });
    });

    it("dispatches the first error with the specified type if well formatted", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(500, mockFailure("some error message"));

        let dispatchedType: any = false;
        let dispatchedPayload: any = false;

        const dispatch = ({type, payload}: RootAction) => {
            dispatchedType = type;
            dispatchedPayload = payload;
        };

        await api(rootState.language, dispatch as any)
            .withError(ActionType.UPLOAD_ERROR_ADDED)
            .get("/datasets/");

        expect(dispatchedType).toBe(ActionType.UPLOAD_ERROR_ADDED);
        expect(dispatchedPayload).toStrictEqual(mockError("some error message"));
    });

    it("dispatches the first error with specified type if the error detail is missing", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(500, mockFailure(null as any));

        let dispatchedType: any = false;
        let dispatchedPayload: any = false;

        const dispatch = ({type, payload}: RootAction) => {
            dispatchedType = type;
            dispatchedPayload = payload;
        };

        await api(rootState.language, dispatch as any)
            .withError(ActionType.UPLOAD_ERROR_ADDED)
            .get("/datasets/");

        expect(dispatchedType).toBe(ActionType.UPLOAD_ERROR_ADDED);
        expect(dispatchedPayload).toStrictEqual({error: "OTHER_ERROR", detail: null});
    });

    it("dispatches the success response with the specified type", async () => {

        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(true));

        let dispatchedType: any = false;
        let dispatchedPayload: any = false;
        const dispatch = ({type, payload}: RootAction) => {
            dispatchedType = type;
            dispatchedPayload = payload;
        };

        await api(rootState.language, dispatch as any)
            .withSuccess(ActionType.DATASET_METADATA_FETCHED)
            .get("/datasets/");

        expect(dispatchedType).toBe(ActionType.DATASET_METADATA_FETCHED);
        expect(dispatchedPayload).toBe(true);
    });

    it("returns the response object", async () => {

        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess("TEST"));

        const dispatch = jest.fn();
        const response = await api(rootState.language, dispatch as any)
            .withSuccess(ActionType.DATASET_SELECTED)
            .get("/datasets/");

        expect(response).toStrictEqual({data: "TEST", errors: null, status: "success"});
    });

    it("throws error if API response is null", async () => {

        mockAxios.onGet(`/datasets/`)
            .reply(500);

        await expectCouldNotParseAPIResponseError();
    });

    it("throws error if API response status is missing", async () => {

        mockAxios.onGet(`/datasets/`)
            .reply(500, {data: {}, errors: []});

        await expectCouldNotParseAPIResponseError();
    });

    it("throws error if API response errors are missing", async () => {

        mockAxios.onGet(`/datasets/`)
            .reply(500, {data: {}, status: "failure"});

        await expectCouldNotParseAPIResponseError();
    });

    it("does nothing on error if ignoreErrors is true", async () => {

        mockAxios.onGet(`/datasets/`)
            .reply(500, mockFailure("some error message"));

        await api(rootState.language, jest.fn() as any)
            .withSuccess(ActionType.DATASET_SELECTED)
            .ignoreErrors()
            .get("/datasets/");

        expect((console.warn as jest.Mock).mock.calls.length).toBe(0);
    });

    it("warns if error and success handlers are not set", async () => {

        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(true));

        await api(rootState.language, jest.fn() as any)
            .get("/datasets/");

        const warnings = (console.warn as jest.Mock).mock.calls;

        expect(warnings[0][0]).toBe("No error handler registered for request /datasets/.");
        expect(warnings[1][0]).toBe("No success handler registered for request /datasets/.");
    });

    it("does not warn that success handler is not set if ignoreSuccess is true", async () => {
        mockAxios.onGet(`/datasets/`)
            .reply(200, mockSuccess(true));

        await api(rootState.language, jest.fn() as any)
            .ignoreSuccess()
            .get("/datasets/");

        const warnings = (console.warn as jest.Mock).mock.calls;
        expect(warnings.length).toBe(1);
        expect(warnings[0][0]).toBe("No error handler registered for request /datasets/.");
    });

    it("returns the response object from a POST", async () => {

        mockAxios.onPost(`/datasets/`)
            .reply(200, mockSuccess("TEST"));

        const dispatch = jest.fn();
        const response = await api(rootState.language, dispatch as any)
            .withSuccess(ActionType.DATASET_SELECTED)
            .postAndReturn("/datasets/", {});

        expect(response).toStrictEqual({data: "TEST", errors: null, status: "success"});
    });

    async function expectCouldNotParseAPIResponseError() {
        const dispatch = jest.fn();
        await api(rootState.language, dispatch as any)
            .get("/datasets/");

        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.ERROR_ADDED);
        expect(dispatch.mock.calls[1][0].payload).toStrictEqual({
            error: "MALFORMED_RESPONSE",
            detail: "Could not parse API response. If error persists, please contact support."
        });
    }
});
