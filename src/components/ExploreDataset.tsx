import React, {useContext, useEffect} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {PopulationPlots} from "./PopulationPlots";
import {IndividualPlots} from "./IndividualPlots";
import {ManageDatasets} from "./ManageDatasets";
import {useParams} from "react-router-dom";
import {dataService} from "../services/dataService";
import {Row} from "react-bootstrap";
import SideBar from "./SideBar";

export default function ExploreDataset({isPublic}: {isPublic: boolean}) {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);
    const params = useParams()

    useEffect(() => {
        const name = params.name!!
        dispatch({
            type: ActionType.DATASET_SELECTED,
            payload: {dataset: name, public: isPublic}
        });
        dataService(state.language, dispatch)
            .getDatasetMetadata(name, isPublic);
    }, [isPublic, state.language, params.name, dispatch]);

    if (!state.selectedDataset) {
        return <ManageDatasets/>
    }
    if (state.selectedPlot === "population") {
        return <Row>
            <SideBar/>
            <PopulationPlots/>
        </Row>
    } else {
        return <Row>
            <SideBar/>
            <IndividualPlots/>
        </Row>
    }
}
