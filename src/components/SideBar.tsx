import Form from 'react-bootstrap/Form';
import {Col, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import CovariateOptions from "./CovariateOptions";
import SelectedCovariate from "./SelectedCovariate";
import ChooseDataset from "./ChooseDataset";
import ChooseScale from "./ChooseScale";
import SplineOptions from "./SplineOptions";
import ChoosePlot from "./ChoosePlot";
import PopulationOptions from "./PopulationOptions";
import IndividualOptions from "./IndividualOptions";

export default function SideBar() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const selectDataset = (name: string) => {
        dispatch({
            type: ActionType.DATASET_SELECTED,
            payload: name
        })
    }

    const selectPlot = (name: string) => {
        dispatch({
            type: ActionType.PLOT_SELECTED,
            payload: name
        })
    }

    const selectedCovariates = state.datasetSettings[state.selectedDataset]
        .covariateSettings
        .map(v => v.name);

    const availableCovariates = state.datasetMetadata?.variables
        .filter(v => selectedCovariates.indexOf(v.name) === -1) ?? [];

    return <Col xs="3" className="pt-3 border-1 border-end border-secondary"
                data-testid="sidebar">
        <Form>
            <fieldset>
                <ChooseDataset selectedDataset={state.selectedDataset}
                               selectDataset={selectDataset}/>
                <ChoosePlot selectedPlot={state.selectedPlot}
                            selectPlot={selectPlot}/>
                <Row className={"mb-3"}>
                    <Col>
                        Detected biomarkers <br/><span
                        className={"text-secondary"}>{state.datasetMetadata?.biomarkers.join(", ")}</span>
                    </Col>
                </Row>
                <ChooseScale/>
                <hr/>
                <PopulationOptions/>
                <IndividualOptions/>
            </fieldset>
        </Form>
    </Col>
}
