import {mockAppState, mockAxios, mockError, mockFailure, mockSuccess} from "./mocks";
import {api} from "../src/services/apiService";
import {ActionType} from "../src/RootContext";

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
        mockAxios.onGet(`/baseline/`)
            .reply(500, mockFailure("some error message"));

        try {
            await api(rootState.language, jest.fn() as any)
                .get("/baseline/")
        } catch (e) {

        }
        expect((console.warn as jest.Mock).mock.calls[0][0])
            .toBe("No error handler registered for request /baseline/.");
        expect((console.log as jest.Mock).mock.calls[0][0].errors[0].detail)
            .toBe("some error message");
    });

    it("dispatches the the first error message by default", async () => {

        mockAxios.onGet(`/unusual/`)
            .reply(500, mockFailure("some error message"));

        const dispatch = jest.fn();

        await api(rootState.language, dispatch as any)
            .get("/unusual/");

        expect((console.warn as jest.Mock).mock.calls[0][0])
            .toBe("No error handler registered for request /unusual/.");

        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0]).toBe("AddError");
        expect(dispatch.mock.calls[0][1]).toStrictEqual(mockError("some error message"));
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

        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0]).toBe(ActionType.ERROR_ADDED);
        expect(dispatch.mock.calls[0][1]).toStrictEqual({
            error: "MALFORMED_RESPONSE",
            detail: "API response failed but did not contain any error information. Please contact support.",
        });
    });

    it("dispatches the first error with the specified type if well formatted", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(500, mockFailure("some error message"));

        let dispatchedType: any = false;
        let dispatchedPayload: any = false;

        const dispatch = (type: string, payload: any) => {
            dispatchedType = type;
            dispatchedPayload = payload;
        };

        await api(rootState.language, dispatch as any)
            .withError(ActionType.UPLOAD_ERROR_ADDED)
            .get("/baseline/");

        expect(dispatchedType).toBe("UploadErrorAdded");
        expect(dispatchedPayload).toStrictEqual(mockError("some error message"));
    });

    it("dispatches the error type if the error detail is missing", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(500, mockFailure(null as any));

        let dispatchedType: any = false;
        let dispatchedPayload: any = false;

        const dispatch = (type: string, payload: any) => {
            dispatchedType = type;
            dispatchedPayload = payload;
        };

        await api(rootState.language, dispatch as any)
            .withError(ActionType.UPLOAD_ERROR_ADDED)
            .get("/baseline/");

        expect(dispatchedType).toBe("UploadErrorAdded");
        expect(dispatchedPayload).toStrictEqual({error: "OTHER_ERROR", detail: null});
    });

    it("dispatches the success response with the specified type", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(200, mockSuccess(true));

        let dispatchedType: any = false;
        let dispatchedPayload: any = false;
        const dispatch = (type: string, payload: any) => {
            dispatchedType = type;
            dispatchedPayload = payload;
        };

        await api(rootState.language, dispatch as any)
            .withSuccess(ActionType.DATA_FETCHED)
            .get("/baseline/");

        expect(dispatchedType).toBe(ActionType.DATA_FETCHED);
        expect(dispatchedPayload).toBe(true);
    });

    it("returns the response object", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(200, mockSuccess("TEST"));

        const dispatch = jest.fn();
        const response = await api(rootState.language, dispatch as any)
            .withSuccess(ActionType.DATASET_SELECTED)
            .get("/baseline/");

        expect(response).toStrictEqual({data: "TEST", errors: null, status: "success"});
    });

    it("throws error if API response is null", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(500);

        await expectCouldNotParseAPIResponseError();
    });

    it("throws error if API response status is missing", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(500, {data: {}, errors: []});

        await expectCouldNotParseAPIResponseError();
    });

    it("throws error if API response errors are missing", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(500, {data: {}, status: "failure"});

        await expectCouldNotParseAPIResponseError();
    });

    it("does nothing on error if ignoreErrors is true", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(500, mockFailure("some error message"));

        await api(rootState.language, jest.fn() as any)
            .withSuccess(ActionType.DATASET_SELECTED)
            .ignoreErrors()
            .get("/baseline/");

        expect((console.warn as jest.Mock).mock.calls.length).toBe(0);
    });

    it("warns if error and success handlers are not set", async () => {

        mockAxios.onGet(`/baseline/`)
            .reply(200, mockSuccess(true));

        await api(rootState.language, jest.fn() as any)
            .get("/baseline/");

        const warnings = (console.warn as jest.Mock).mock.calls;

        expect(warnings[0][0]).toBe("No error handler registered for request /baseline/.");
        expect(warnings[1][0]).toBe("No success handler registered for request /baseline/.");
    });

    it("does not warn that success handler is not set if ignoreSuccess is true", async () => {
        mockAxios.onGet(`/baseline/`)
            .reply(200, mockSuccess(true));

        await api(rootState.language, jest.fn() as any)
            .ignoreSuccess()
            .get("/baseline/");

        const warnings = (console.warn as jest.Mock).mock.calls;
        expect(warnings.length).toBe(1);
        expect(warnings[0][0]).toBe("No error handler registered for request /baseline/.");
    });

    it("returns the response object from a POST", async () => {

        mockAxios.onPost(`/baseline/`)
            .reply(200, mockSuccess("TEST"));

        const dispatch = jest.fn();
        const response =    await api(rootState.language, dispatch as any)
            .withSuccess(ActionType.DATASET_SELECTED)
            .postAndReturn("/baseline/", {});

        expect(response).toStrictEqual({data: "TEST", errors: null, status: "success"});
    });

    async function expectCouldNotParseAPIResponseError() {
        const dispatch = jest.fn();
        await api(rootState.language, dispatch as any)
            .get("/baseline/");

        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0]).toBe(ActionType.ERROR_ADDED);
        expect(dispatch.mock.calls[0][1]).toStrictEqual({
            error: "MALFORMED_RESPONSE",
            detail: "Could not parse API response. Please contact support."
        });
    }
});
