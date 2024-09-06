import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import Form from "react-bootstrap/Form";

export default function ChooseScale() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const onSelect = (event: any) => {
        dispatch({
            type: ActionType.SELECT_SCALE,
            payload: event.target.value
        });
    }

    return <Form.Group key="choose-scale"  className="mb-3">
        <Form.Label htmlFor="scale">Transform data by</Form.Label>
        <Form.Select id="scale" onChange={onSelect}
                     value={state.datasetSettings[state.selectedDataset].scale}>
            <option value={"natural"}>none</option>
            <option value={"log"}>log (log base 10)</option>
            <option value={"log2"}>log2 (log base 2)</option>
        </Form.Select>
    </Form.Group>
}
