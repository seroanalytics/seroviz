import Form from 'react-bootstrap/Form';
import {Col} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import CovariateOptions from "./CovariateOptions";
import SelectedCovariateOption from "./SelectedCovariateOption";

export default function Sidebar() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const onSelectData = (event: any) => {
        dispatch({type: ActionType.DATASET_SELECTED, payload: event.target.value})
    }

    const selectedCovariates = state.selectedCovariates.map(v => v.name);

    const availableCovariates = state.dataset?.variables
        .filter(v => selectedCovariates.indexOf(v) === -1) ?? [];

    console.log(availableCovariates)

    return <Col xs="3" className="pt-3 border-1 border-end border-secondary">
        <Form method="post">
            <fieldset>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="data">Dataset</Form.Label>
                    <Form.Select id="data" onChange={onSelectData} value={state.selectedDataset}>
                        {state.datasets.map(d =>
                            <option key={d} value={d}>{d}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Disaggregate by:</Form.Label>
                    {availableCovariates.length > 0 && <CovariateOptions covariates={availableCovariates}/>}
                    {state.selectedCovariates.map(v => <SelectedCovariateOption
                        key={v.name}
                        covariate={v}/>)}
                </Form.Group>
            </fieldset>
        </Form>
    </Col>
}
