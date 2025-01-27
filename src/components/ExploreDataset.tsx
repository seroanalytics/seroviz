import React, {useContext, useEffect} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {PopulationPlots} from "./PopulationPlots";
import {IndividualPlots} from "./IndividualPlots";
import {ManageDatasets} from "./ManageDatasets";
import {useParams, useSearchParams} from "react-router-dom";
import {dataService} from "../services/dataService";

export default function ExploreDataset() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);
    const params = useParams()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const name = params.name!!
        const isPublic = searchParams.get("public") === "true"
        dispatch({
            type: ActionType.DATASET_SELECTED,
            payload: {dataset: name, public: isPublic}
        });
        dataService(state.language, dispatch)
            .getDatasetMetadata(name, isPublic);
    }, [state.language, searchParams, params.name, dispatch]);

    useEffect(() => {
        if (state.selectedDataset) {
            dataService(state.language, dispatch)
                .getDatasetMetadata(state.selectedDataset, state.selectedDatasetIsPublic);
        }
    }, [state.selectedDataset, state.language, dispatch, state.selectedDatasetIsPublic]);


    if (!state.selectedDataset) {
        return <ManageDatasets/>
    }
    if (state.selectedPlot === "population") {
        return <PopulationPlots/>
    } else {
        return <IndividualPlots/>
    }
}
