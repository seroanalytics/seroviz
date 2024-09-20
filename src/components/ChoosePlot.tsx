import Form from "react-bootstrap/Form";
import React from "react";

interface Props {
    selectedPlot: string;
    selectPlot: (name: string) => void
}

export default function ChoosePlot({selectedPlot, selectPlot}: Props) {

    const onSelectPlot = (event: any) => {
        selectPlot(event.target.value);
    }

    return <Form.Group key="choose-plot" className={"mb-3"}>
        <Form.Label htmlFor="plot">Choose
            plot</Form.Label>
        <Form.Select id="plot" onChange={onSelectPlot}
                     value={selectedPlot}>
            <option value={"population"}>Population</option>
            <option value={"individual"}>Individual</option>
        </Form.Select>
    </Form.Group>
}
