import {Button, Col, Form, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {ActionType, RootDispatchContext} from "../RootContext";
import {Variable} from "../generated";

interface Props {
    covariates: Variable[]
}

export default function CovariateOptions({covariates}: Props) {

    const [selectedVariableName, selectVariableName] = useState(covariates[0].name);
    const [selectedDisplayOption, selectDisplayOption] = useState("trace");
    const dispatch = useContext(RootDispatchContext);

    useEffect(() => {
        selectVariableName(covariates[0].name)
    }, [covariates])

    const onChange = (event: any) => {
        selectVariableName(event.target.value);
    }

    const onChangeDisplayOption = (event: any) => {
        selectDisplayOption(event.target.value)
    }

    const add = () => {
        const selectedVariable = covariates.find(v => v.name === selectedVariableName)!!
        dispatch({
            type: ActionType.SELECT_COVARIATE,
            payload: {
                name: selectedVariable.name,
                levels: selectedVariable.levels.filter(l => l === 0 || l),
                display: selectedDisplayOption
            }
        })
    }

    return <Form.Group className={"border p-2 mb-2 bg-light"}>
        <Row className={"mt-2"}>
            <Form.Label column sm="6" htmlFor="variable">
                Variable:
            </Form.Label>
            <Col sm="6">
                <Form.Select role="listbox"
                             name="variable"
                             value={selectedVariableName} onChange={onChange}>
                    {covariates.map((v) =>
                        <option role="listitem" key={v.name}
                                value={v.name}>{v.name}</option>
                    )}
                </Form.Select>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Form.Label column sm="6" htmlFor="displayType">
                Display as:
            </Form.Label>
            <Col sm="6">
                <Form.Select role="listbox"
                             name="displayType"
                             value={selectedDisplayOption}
                             onChange={onChangeDisplayOption}>
                    <option role="listitem" value="trace">trace</option>
                    <option role="listitem" value="facet">facet</option>
                </Form.Select>
            </Col>
        </Row>
        <Button variant="success" className={"mt-2 mb-3"}
                onClick={add}>Add</Button>
    </Form.Group>
}
