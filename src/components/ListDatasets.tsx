import Form from "react-bootstrap/Form";
import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {Button} from "react-bootstrap";
import {dataService} from "../services/dataService";

function DatasetListItem({dataset, onSelectDataset, onRemoveDataset}: {
    dataset: string,
    onSelectDataset: (d: string) => void
    onRemoveDataset: (d: string) => void
}) {
    return <li key={dataset}>
        <Button href="#" variant={"link"} className={"ps-0"}
                onClick={() => onSelectDataset(dataset)}>{dataset}</Button>
        <Button href="#" variant={"close"}
                onClick={() => onRemoveDataset(dataset)}></Button>
    </li>
}

export default function ListDatasets() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const onSelectData = (dataset: string) => {
        dispatch({type: ActionType.DATASET_SELECTED, payload: dataset})
    }
    const onRemoveData = async (dataset: string) => {
        await dataService(state.language, dispatch)
            .deleteDataset(dataset);
    }

    return <Form.Group key="choose-dataset" className={"mb-5"}>
        <h4>Available datasets</h4>
        <ul className={"list-unstyled"}>
            {state.datasetNames.map((d: string) =>
                <DatasetListItem key={d} dataset={d}
                                 onSelectDataset={onSelectData}
                                 onRemoveDataset={onRemoveData}/>)}
        </ul>
    </Form.Group>
}
