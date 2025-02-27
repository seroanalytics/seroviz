import {API, APIService} from "./apiService";
import {ActionType, RootAction} from "../RootContext";
import {
    DataSeries,
    DatasetMetadata,
    DatasetNames,
    Plotly, PublicDatasets,
    UploadResult
} from "../generated";
import {
    CovariateSettings,
    GenericResponse,
    IndividualSettings,
    SplineSettings,
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

    async getPublicDatasets(): Promise<void | GenericResponse<PublicDatasets>> {
        return await this._api
            .withSuccess(ActionType.PUBLIC_DATASETS_FETCHED)
            .withError(ActionType.ERROR_ADDED)
            .get<PublicDatasets>("/public/datasets/")
    }

    async getDatasetMetadata(selectedDataset: string, isPublic: boolean): Promise<void | GenericResponse<DatasetMetadata>> {
        return await this._api
            .withSuccess(ActionType.DATASET_METADATA_FETCHED)
            .withError(ActionType.ERROR_ADDED)
            .get<DatasetMetadata>("/dataset/" + selectedDataset + "/" + (isPublic ? "?public=TRUE": ""))
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
                        splineSettings: SplineSettings,
                        isPublic: boolean) {

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

        if (isPublic) {
            queryString += "&public=TRUE"
        }

        return await this._api
            .ignoreSuccess()
            .ignoreErrors()
            .get<DataSeries>("/dataset/" + selectedDataset + "/trace/" + encodeURIComponent(biomarker) + "/" + queryString)
    }

    async getIndividualData(selectedDataset: string,
                            scale: "log" | "natural" | "log2",
                            individualSettings: IndividualSettings,
                            page: number,
                            isPublic: boolean) {

        let queryString = `?color=${encodeURIComponent(individualSettings.color)}&`
        queryString += `linetype=${encodeURIComponent(individualSettings.linetype)}&`
        queryString += `page=${page}&`
        if (individualSettings.filter) {
            queryString += `filter=${encodeURIComponent(individualSettings.filter)}&`
        }

        queryString += `scale=${scale}`

        if (isPublic) {
            queryString += "&public=TRUE"
        }

        return await this._api
            .ignoreSuccess()
            .ignoreErrors()
            .get<Plotly>("/dataset/" + selectedDataset + "/individual/" + individualSettings.pid + "/" + queryString)
    }

    async deleteDataset(dataset: string) {
        return await this._api
            .withSuccess(ActionType.DATASET_DELETED)
            .withError(ActionType.ERROR_ADDED)
            .delete("/dataset/" + dataset + "/")
    }

    async endSession() {
        return await this._api
            .withSuccess(ActionType.SESSION_ENDED)
            .ignoreErrors()
            .delete("/session/")
    }
}

export const dataService = (lang: string, dispatch: Dispatch<RootAction>) => new DataService(new APIService(lang, dispatch));
