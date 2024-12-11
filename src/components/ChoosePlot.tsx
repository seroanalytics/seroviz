import Form from "react-bootstrap/Form";
import React from "react";

interface Props {
    selectedPlot: string;
    selectPlot: (name: string) => void
    seriesType: "surveillance" | "post-exposure"
}

export default function ChoosePlot({
                                       selectedPlot,
                                       selectPlot,
                                       seriesType
                                   }: Props) {

    const onSelectPlot = (event: any) => {
        selectPlot(event.target.value);
    }

    return <Form.Group key="choose-plot" className={"mb-3"}>
        <Form.Label htmlFor="plot">Choose
            plot</Form.Label>
        <Form.Select id="plot" onChange={onSelectPlot}
                     value={selectedPlot}>
            <option value={"population"}>Population trajectories</option>
            {/*{seriesType === "post-exposure" &&*/}
            {/*    <option value={"histogram"}>Population histogram</option>*/}
            {/*}*/}
            <option value={"individual"}>Individual trajectories</option>
        </Form.Select>
    </Form.Group>
}
