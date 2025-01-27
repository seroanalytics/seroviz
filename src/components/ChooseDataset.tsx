import Form from "react-bootstrap/Form";
import React, {useContext} from "react";
import {RootContext} from "../RootContext";
import {useNavigate} from "react-router-dom";

interface Props {
    selectedDataset: string;
    selectDataset: (name: string, isPublic: boolean) => void
}

export default function ChooseDataset({selectedDataset, selectDataset}: Props) {

    const state = useContext(RootContext);
    const navigate = useNavigate();

    const onSelectData = (event: any) => {
       const datasetName = event.target.value;
        const isPublic = !!event.target[event.target.selectedIndex].getAttribute('data-public')
        navigate(`/dataset/${datasetName}?public=${isPublic}`)
    }

    return <Form.Group key="choose-dataset" className={"mb-3"}>
        <Form.Label htmlFor="data">Choose
            dataset</Form.Label>
        <Form.Select id="data" onChange={onSelectData}
                     value={selectedDataset}>
            {state.datasetNames.map((d: string) =>
                <option key={d} value={d}>{d}</option>)}
            <option disabled={true}>-- Public datasets --</option>
            {state.publicDatasets.map(d =>
                <option key={d.name} data-public={true} value={d.name}>{d.name}</option>)}
        </Form.Select>
    </Form.Group>
}
