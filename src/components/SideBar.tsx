import Form from 'react-bootstrap/Form';
import {Col, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import CovariateOptions from "./CovariateOptions";
import SelectedCovariate from "./SelectedCovariate";
import ChooseDataset from "./ChooseDataset";
import ChooseScale from "./ChooseScale";

export default function SideBar() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const selectDataset = (name: string) => {
        dispatch({
            type: ActionType.DATASET_SELECTED,
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
        <Form method="post">
            <fieldset>
                <ChooseDataset selectedDataset={state.selectedDataset}
                               selectDataset={selectDataset}/>
                <Row className={"mb-3 mt-3"}>
                    <Col>
                        Detected biomarkers <br/><span
                        className={"text-secondary"}>{state.datasetMetadata?.biomarkers.join(", ")}</span>
                    </Col>
                </Row>
                <ChooseScale />
                {availableCovariates.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Disaggregate by</Form.Label>
                        <CovariateOptions covariates={availableCovariates}/>
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    {state.datasetSettings[state.selectedDataset]
                        .covariateSettings
                        .map(v =>
                            <SelectedCovariate
                                key={v.name}
                                covariate={v}/>)}
                </Form.Group>
            </fieldset>
        </Form>
    </Col>
}
