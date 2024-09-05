import {Button, Col, Form, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootDispatchContext} from "../RootContext";
import {CovariateSettings} from "../types";


export default function SelectedCovariate({covariate}: { covariate: CovariateSettings, key: string }) {

    const dispatch = useContext(RootDispatchContext);

    const remove = () => {
        dispatch({
            type: ActionType.UNSELECT_COVARIATE,
            payload: covariate.name
        })
    }

    return <Form.Group className={"border p-2 mb-2 bg-light"}>
        <Row style={{justifyContent: "flex-end"}}>
            <Button variant={"close"} role={"close"} onClick={remove}
                    className={"mx-2"}></Button>
        </Row>
        <Row>
            <Form.Label column sm="6">
                Variable:
            </Form.Label>
            <Col sm="6">
                <Form.Label column sm="6">
                    {covariate.name}
                </Form.Label>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Form.Label column sm="6">
                Display as:
            </Form.Label>
            <Col sm="6">
                <Form.Label column sm="6">
                    {covariate.display}
                </Form.Label>
            </Col>
        </Row>
    </Form.Group>
}
