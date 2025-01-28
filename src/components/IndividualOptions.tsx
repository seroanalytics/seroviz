import Form from "react-bootstrap/Form";
import React, {useContext, useState} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {Col, Row} from "react-bootstrap";

export default function IndividualOptions() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);
    const variables = [...state.datasetMetadata?.variables.map(v => v.name) || [], "biomarker"]

    const [filterBy, setFilterBy] = useState("");
    const [filterLevel, setFilterLevel] = useState("");

    if (state.selectedPlot !== "individual") {
        return null
    }

    const settings = state.datasetSettings[state.selectedDataset].individualSettings;

    let filterLevels = state.datasetMetadata?.variables.find(v => v.name === filterBy)?.levels as string[] || [];
    if (filterBy === "biomarker") {
        filterLevels = [...state.datasetMetadata?.biomarkers || []]
    }

    const onSelectFilter = (event: any) => {
        setFilterBy(event.target.value);
        dispatch({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {filter: ""}
        })
    }

    const onSelectFilterLevel = (event: any) => {
        const level = event.target.value;
        setFilterLevel(level);
        let filter = "";
        if (level) {
            filter = `${filterBy}:${event.target.value}`
        }
        dispatch({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {filter: filter}
        })
    }

    const onSelectIdCol = (event: any) => {
        dispatch({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {pid: event.target.value}
        })
    }

    const onSelectColor = (event: any) => {
        dispatch({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {color: event.target.value}
        })
    }

    const onSelectLinetype = (event: any) => {
        dispatch({
            type: ActionType.SET_INDIVIDUAL_OPTIONS,
            payload: {linetype: event.target.value}
        })
    }

    return <fieldset>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="idcol">Id column</Form.Label>
            <Form.Select id="idcol" value={settings.pid}
                         role="listbox"
                         onChange={onSelectIdCol}>
                <option value="">--Select--</option>
                {variables.map(v => <option key={v} value={v}>{v}</option>)}
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="color">Color</Form.Label>
            <Form.Select id="color" value={settings.color}
                         role="listbox"
                         onChange={onSelectColor}>
                <option value="">None</option>
                {variables.filter(v => v !== settings.pid).map(v => <option
                    value={v} key={v}>{v}</option>)}
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="linetype">Linetype</Form.Label>
            <Form.Select id="linetype" value={settings.linetype}
                         role="listbox"
                         onChange={onSelectLinetype}>
                <option value="">None</option>
                {variables.filter(v => v !== settings.pid).map(v => <option
                    value={v} key={v}>{v}</option>)}
            </Form.Select>
        </Form.Group>
        <Form.Group>
            <Form.Label htmlFor="filter">Filter by</Form.Label>
            <Row>
                <Col sm={6}>
                    <Form.Select id="filter" value={filterBy}
                                 role="listbox"
                                 onChange={onSelectFilter}>
                        <option value="">None</option>
                        {variables.map(v => <option value={v} key={v}>{v}</option>)}
                    </Form.Select>
                </Col>
                <Col sm={6}>
                    {filterLevels.length > 0 &&
                        <Form.Select id="filterLevel" value={filterLevel}
                                     role="listbox"
                                     onChange={onSelectFilterLevel}>
                            <option value="">--Select--</option>
                            {filterLevels.map(l => <option
                                value={l} key={l}>{l}</option>)}
                        </Form.Select>
                    }
                </Col>
            </Row>
        </Form.Group>
    </fieldset>
}
