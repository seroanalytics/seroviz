import axios, {AxiosError, AxiosResponse} from "axios";
import {GenericResponse} from "../types";
import {ActionType, RootAction} from "../RootContext";
import {ErrorDetail, ResponseFailure} from "../generated";

declare let apiUrl: string;

function isPorcelainError(object: any): object is ErrorDetail {
    return typeof object.error == "string"
        && (object.detail === undefined || object.detail === null || typeof object.detail == "string")
}

function isPorcelainResponse<T>(object: any): object is GenericResponse<T> {
    return object && (typeof object.status == "string")
        && (Array.isArray(object.errors))
        && typeof object.data == "object"
        && object.errors.every((e: any) => isPorcelainError(e))
}

export interface API<A> {
    withError: (type: A) => API<A>
    withSuccess: (type: A) => API<A>
    ignoreErrors: () => API<A>
    ignoreSuccess: () => API<A>

    postAndReturn<T>(url: string, data: any): Promise<void | GenericResponse<T>>
    get<T>(url: string): Promise<void | GenericResponse<T>>
    delete(url: string): Promise<void | true>
}

export class APIService implements API<ActionType> {

    private readonly _dispatch: (action: RootAction) => void;
    private readonly _headers: any;

    constructor(lang: string, dispatch: (action: any) => void) {
        this._dispatch = dispatch;
        this._headers = {"Accept-Language": lang};
        axios.defaults.withCredentials = true;
    }

    // apiUrl will be set as a jest global during testing
    private readonly _baseUrl = typeof apiUrl !== "undefined" ? apiUrl : "";

    private _buildFullUrl = (url: string) => {
        return this._baseUrl + url
    };

    private _ignoreErrors = false;
    private _ignoreSuccess = false;

    static getFirstErrorFromFailure = (failure: ResponseFailure) => {
        if (failure.errors.length === 0) {
            return APIService.createError("API response failed but did not contain any error information. If error persists, please contact support.");
        }
        return failure.errors[0];
    };

    static createError(detail: string| null, error: string = "MALFORMED_RESPONSE") {
        return {
            error: error,
            detail: detail
        }
    }

    private _onError: ((failure: ResponseFailure) => void) | null = null;

    private _onSuccess: ((success: GenericResponse<any>) => void) | null = null;

    withError = (type: ActionType) => {
        this._onError = (failure: ResponseFailure) => {
            this._dispatch({type: type, payload: APIService.getFirstErrorFromFailure(failure)});
        };
        return this;
    };

    ignoreErrors = () => {
        this._ignoreErrors = true;
        return this;
    };

    ignoreSuccess = () => {
        this._ignoreSuccess = true;
        return this;
    };

    withSuccess = (type: ActionType) => {
        this._onSuccess = (data: any) => {
            this._dispatch({type: type, payload: data});
        };
        return this;
    };

    private _handleAxiosResponse(promise: Promise<AxiosResponse>) {
        return promise.then((axiosResponse: AxiosResponse) => {
            const success = axiosResponse && axiosResponse.data;
            const data = success.data;
            if (this._onSuccess) {
                this._onSuccess(data);
            }
            return success;
        }).catch((e: AxiosError) => {
            return this._handleError(e)
        });
    }

    private _handleError = (e: AxiosError) => {
        console.log(e.response && (e.response.data || e));

        if (!this._ignoreErrors) {
            this._handleDispatchError(e.response && e.response.data)
        }

        if (e.response && e.response.status === 404) {
            this._dispatchError(APIService.createError("Your session may have expired.", "SESSION_EXPIRED"));
        }
    };

    private _dispatchError = (error: ErrorDetail) => {
        this._dispatch({type: ActionType.ERROR_ADDED, payload: error});
    };

    private _clearErrors = () => {
        this._dispatch({type: ActionType.CLEAR_ALL_ERRORS, payload: null});
    };

    private _verifyHandlers(url: string) {
        if (this._onError == null && !this._ignoreErrors) {
            console.warn(`No error handler registered for request ${url}.`)
        }
        if (this._onSuccess == null && !this._ignoreSuccess) {
            console.warn(`No success handler registered for request ${url}.`)
        }
    }

    async get<T>(url: string): Promise<void | GenericResponse<T>> {
        this._verifyHandlers(url);
        this._clearErrors();
        const fullUrl = this._buildFullUrl(url);
        return this._handleAxiosResponse(axios.get(fullUrl, {headers: this._headers}));
    }

    private _handleDispatchError = (error: any) => {
        if (!isPorcelainResponse(error)) {
            this._dispatchError(APIService.createError("Could not parse API response. If error persists, please contact support."));
        } else if (this._onError) {
            this._onError(error as ResponseFailure);
        } else {
            this._dispatchError(APIService.getFirstErrorFromFailure(error as ResponseFailure));
        }
    }

    async postAndReturn<T>(url: string, data?: any): Promise<void | GenericResponse<T>> {
        this._verifyHandlers(url);
        this._clearErrors();
        const fullUrl = this._buildFullUrl(url);

        // this allows us to pass data of type FormData in both the browser and
        // in node for testing, using the "form-data" package in the latter case
        const headers = data && typeof data.getHeaders == "function" ?
            {...this._headers, ...data.getHeaders()}
            : this._headers;

        return this._handleAxiosResponse(axios.post(fullUrl, data, {headers}));
    }

    async delete(url: string) {
        this._clearErrors();
        const fullUrl = this._buildFullUrl(url);
        return this._handleAxiosResponse(axios.delete(fullUrl));
    }

}

export const api = (lang: string, dispatch: (action: RootAction) => void) => new APIService(lang, dispatch);
