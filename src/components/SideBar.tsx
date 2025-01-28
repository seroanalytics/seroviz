import Form from 'react-bootstrap/Form';
import {Col, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import ChooseDataset from "./ChooseDataset";
import ChooseScale from "./ChooseScale";
import ChoosePlot from "./ChoosePlot";
import PopulationOptions from "./PopulationOptions";
import IndividualOptions from "./IndividualOptions";

export default function SideBar() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const selectPlot = (name: string) => {
        dispatch({
            type: ActionType.PLOT_SELECTED,
            payload: name
        })
    }

    return <Col xs="3" className="pt-3 border-1 border-end border-secondary"
                data-testid="sidebar">
        <Form>
            <fieldset>
                <ChooseDataset selectedDataset={state.selectedDataset}/>
                <Row className={"mb-3"}>
                    <Col>
                        Time series type <br/><span
                        className={"text-secondary"}>{state.datasetMetadata?.type}</span>
                    </Col>
                </Row>
                <Row className={"mb-3"}>
                    <Col>
                        Detected biomarkers <br/><span
                        className={"text-secondary"}>{state.datasetMetadata?.biomarkers.join(", ")}</span>
                    </Col>
                </Row>
                <ChoosePlot selectedPlot={state.selectedPlot}
                            selectPlot={selectPlot}
                            seriesType={state.datasetMetadata?.type || "surveillance"}/>
                <ChooseScale/>
                <hr/>
                <PopulationOptions/>
                <IndividualOptions/>
            </fieldset>
        </Form>
    </Col>
}
