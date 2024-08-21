import {API, APIService} from "./apiService";
import {ActionType, RootAction} from "../RootContext";
import {
    DataSeries,
    DatasetMetadata,
    DatasetNames,
    UploadResult
} from "../generated";
import {
    GenericResponse, SelectedCovariate,
} from "../types";
import {Dispatch} from "react";

export class DataService {

    private readonly _api: API<ActionType>;

    constructor(api: API<ActionType>) {
        this._api = api;
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
            .get<DatasetMetadata>("/dataset/" + selectedDataset)
    }

    async uploadDataset(formData: FormData) {
        return await this._api
            .withError(ActionType.UPLOAD_ERROR_ADDED)
            .postAndReturn<UploadResult>("/dataset/", formData);
    }

    async getDataSeries(selectedDataset: string,
                        biomarker: string,
                        facetDefinition: string,
                        selectedCovariates: SelectedCovariate[]) {


        const traces = selectedCovariates
            .filter(v => v.display === "trace")
            .map(v => v.name).join("+")

        return await this._api
            .ignoreSuccess()
            .withError(ActionType.ERROR_ADDED)
            .get<DataSeries>("/dataset/" + selectedDataset + "/trace/" + biomarker + "/?filter=" + encodeURIComponent(facetDefinition) + "&disaggregate=" + encodeURIComponent(traces))
    }
}

export const dataService = (lang: string, dispatch: Dispatch<RootAction>) => new DataService(new APIService(lang, dispatch));
