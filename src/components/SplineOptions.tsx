import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import {between} from "../services/utils";

export default function SplineOptions() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const onChangeMethod = (event: any) => {
        dispatch({
            type: ActionType.SET_SPLINE_OPTIONS,
            payload: {method: event.target.value}
        });
    }

    const onChangeSpan = (event: any) => {
        dispatch({
            type: ActionType.SET_SPLINE_OPTIONS,
            payload: {span: between(event.target.value, 0, 1)}
        });
    }

    const onChangeKnots = (event: any) => {
        dispatch({
            type: ActionType.SET_SPLINE_OPTIONS,
            payload: {k: between(event.target.value, 5, 30)}
        });
    }

    const settings = state.datasetSettings[state.selectedDataset].splineSettings;

    return <Form.Group className={"mb-2 border p-2"}>
        <Row className={"mt-2"}>
            <Form.Label column sm="6" htmlFor="method">
                Method:
            </Form.Label>
            <Col sm="6">
                <Form.Select role="listbox"
                             name="method"
                             value={settings.method} onChange={onChangeMethod}>
                    <option>auto</option>
                    <option>gam</option>
                    <option>loess</option>
                </Form.Select>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Form.Label column sm="6" htmlFor="span">
                Span:
            </Form.Label>
            <Col sm="6">
                <Form.Range min={0} max={1} step={0.05} value={settings.span}
                            onChange={onChangeSpan}/>
                <Form.Control type={"number"}
                              name={"span"}
                              value={settings.span}
                              min={0}
                              max={1}
                              step={0.05}
                              onChange={onChangeSpan}/>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Form.Label column sm="6" htmlFor="k">
                k:
            </Form.Label>
            <Col sm="6">
                <Form.Range min={5} max={30} step={1} value={settings.k}
                            onChange={onChangeKnots}/>
                <Form.Control type={"number"}
                              name={"k"}
                             value={settings.k}
                              min={5}
                              max={30}
                             onChange={onChangeKnots}/>
            </Col>
        </Row>
    </Form.Group>
}
