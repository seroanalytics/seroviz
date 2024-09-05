import Form from "react-bootstrap/Form";
import React, {useContext} from "react";
import {RootContext} from "../RootContext";

interface Props {
    selectedDataset: string;
    selectDataset: (name: string) => void
}

export default function ChooseDataset({selectedDataset, selectDataset}: Props) {

    const state = useContext(RootContext);

    const onSelectData = (event: any) => {
        selectDataset(event.target.value);
    }

    return <Form.Group key="choose-dataset">
        <Form.Label htmlFor="data">Choose
            dataset</Form.Label>
        <Form.Select id="data" onChange={onSelectData}
                     value={selectedDataset}>
            {state.datasetNames.map((d: string) =>
                <option key={d} value={d}>{d}</option>)}
        </Form.Select>
    </Form.Group>
}
