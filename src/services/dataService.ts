import {API, APIService} from "./apiService";
import {ActionType, RootAction} from "../RootContext";
import {
    DataSeries,
    DatasetMetadata,
    DatasetNames,
    UploadResult
} from "../generated";
import {
    GenericResponse, CovariateSettings, SplineSettings,
} from "../types";
import {Dispatch} from "react";

export class DataService {

    private readonly _api: API<ActionType>;

    constructor(api: API<ActionType>) {
        this._api = api;
    }

    async refreshSession(): Promise<void | GenericResponse<string>> {
        return await this._api
            .ignoreSuccess()
            .ignoreErrors()
            .get<string>("/")
    }

    async getDatasetNames(): Promise<void | GenericResponse<DatasetNames>> {
        return await this._api
            .withSuccess(ActionType.DATASET_NAMES_FETCHED)
            .withError(ActionType.ERROR_ADDED)
            .get<DatasetNames>("/datasets/")
    }

    async getDatasetMetadata(selectedDataset: string): Promise<void | GenericResponse<DatasetMetadata>> {
        return await this._api
            .withSuccess(ActionType.DATASET_METADATA_FETCHED)
            .withError(ActionType.ERROR_ADDED)
            .get<DatasetMetadata>("/dataset/" + selectedDataset + "/")
    }

    async uploadDataset(formData: FormData) {
        return await this._api
            .ignoreSuccess()
            .withError(ActionType.UPLOAD_ERROR_ADDED)
            .postAndReturn<UploadResult>("/dataset/", formData);
    }

    async getDataSeries(selectedDataset: string,
                        biomarker: string,
                        facetDefinition: string,
                        covariateSettings: CovariateSettings[],
                        scale: "log" | "natural" | "log2",
                        splineSettings: SplineSettings) {


        const traces = covariateSettings
            .filter(v => v.display === "trace")
            .map(v => v.name).join("+")

        let queryString = "?"
        if (facetDefinition) {
            queryString += `filter=${encodeURIComponent(facetDefinition)}&`
        }

        if (traces.length > 0) {
            queryString += `disaggregate=${encodeURIComponent(traces)}&`
        }

        queryString += `scale=${scale}&method=${splineSettings.method}&span=${splineSettings.span}&k=${splineSettings.k}`

        return await this._api
            .ignoreSuccess()
            .ignoreErrors()
            .get<DataSeries>("/dataset/" + selectedDataset + "/trace/" + biomarker + "/" + queryString)
    }
}

export const dataService = (lang: string, dispatch: Dispatch<RootAction>) => new DataService(new APIService(lang, dispatch));
