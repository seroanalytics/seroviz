import {Button, Col, Form, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {ActionType, RootDispatchContext} from "../RootContext";

interface Props {
    covariates: string[]
}

export default function CovariateOptions({covariates}: Props) {

    const [selectedVariable, selectVariable] = useState(covariates[0]);
    const [selectedDisplayOption, selectDisplayOption] = useState("trace");
    const dispatch = useContext(RootDispatchContext);

    useEffect(() => {
        selectVariable(covariates[0])
    }, [covariates])

    const onChange = (event: any) => {
        selectVariable(event.target.value)
    }

    const onChangeDisplayOption = (event: any) => {
        selectDisplayOption(event.target.value)
    }

    const add = () => {
        dispatch({
            type: ActionType.SELECT_COVARIATE,
            payload: {
                name: selectedVariable,
                display: selectedDisplayOption
            }
        })
    }

    return <Form.Group className={"border p-2 mb-2 bg-light"}>
        <Row className={"mt-2"}>
            <Form.Label column sm="6">
                Variable:
            </Form.Label>
            <Col sm="6">
                <Form.Select value={selectedVariable} onChange={onChange}>
                    {covariates.map((v) =>
                        <option key={v} value={v}>{v}</option>
                    )}
                </Form.Select>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Form.Label column sm="6">
                Display as:
            </Form.Label>
            <Col sm="6">
                <Form.Select value={selectedDisplayOption} onChange={onChangeDisplayOption}>
                    <option value={"trace"}>Trace</option>
                    <option value={"facet"}>Facet</option>
                </Form.Select>
            </Col>
        </Row>
        <Button variant="success" className={"mt-2 mb-3"}
                onClick={add}>Add</Button>
    </Form.Group>
}
