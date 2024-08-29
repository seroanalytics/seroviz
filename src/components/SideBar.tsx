import Form from 'react-bootstrap/Form';
import {Col, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import CovariateOptions from "./CovariateOptions";
import SelectedCovariateOption from "./SelectedCovariateOption";

export default function SideBar() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const onSelectData = (event: any) => {
        dispatch({
            type: ActionType.DATASET_SELECTED,
            payload: event.target.value
        })
    }

    const selectedCovariates = state.selectedCovariates.map(v => v.name);

    const availableCovariates = state.datasetMetadata?.variables
        .filter(v => selectedCovariates.indexOf(v.name) === -1) ?? [];

    return <Col xs="3" className="pt-3 border-1 border-end border-secondary"
                data-testid="sidebar">
        <Form method="post">
            <fieldset>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="data">Dataset</Form.Label>
                    <Form.Select id="data" onChange={onSelectData}
                                 value={state.selectedDataset}>
                        {state.datasetNames.map(d =>
                            <option key={d} value={d}>{d}</option>)}
                    </Form.Select>
                </Form.Group>
                <Row className={"mb-3"}>
                    <Col>
                        Detected biomarkers <br/><span
                        className={"text-secondary"}>{state.datasetMetadata?.biomarkers.join(", ")}</span>
                    </Col>
                </Row>
                {availableCovariates.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Disaggregate by</Form.Label>
                        <CovariateOptions covariates={availableCovariates}/>
                    </Form.Group>
                }
                <Form.Group className="mb-3">
                    {state.selectedCovariates.map(v =>
                        <SelectedCovariateOption
                            key={v.name}
                            covariate={v}/>)}
                </Form.Group>
            </fieldset>
        </Form>
    </Col>
}
