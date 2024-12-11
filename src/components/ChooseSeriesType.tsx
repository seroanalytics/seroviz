import Form from "react-bootstrap/Form";
import React from "react";

interface Props {
    selectedType: "surveillance" | "post-exposure";
    selectType: (name:  "surveillance" | "post-exposure") => void
}

export default function ChooseSeriesType({selectedType, selectType}: Props) {

    const onSelectType = (event: any) => {
        selectType(event.target.value);
    }

    return <Form.Group key="choose-dataset" className={"mb-3"}>
        <Form.Label htmlFor="data">Choose
            dataset</Form.Label>
        <Form.Select id="data" onChange={onSelectType}
                     value={selectedType}>
            <option value={"surveillance"}>Surveillance</option>
            <option value={"post-exposure"}>Post-exposure</option>
        </Form.Select>
    </Form.Group>
}
