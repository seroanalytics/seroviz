import {useContext} from "react";
import {RootContext, RootDispatchContext} from "../RootContext";
import {Col, Row} from "react-bootstrap";
import Sidebar from "./SideBar";
import LinePlot from "./LinePlot";

export function ExploreDataset() {

    const state = useContext(RootContext);

    return <Row>
        <Sidebar/>
        <Col>
            {state.dataset &&
                <LinePlot biomarker={"abunits_spike"} facetLevel={"Female"} facetVariable={"sex"}></LinePlot>}
        </Col>
    </Row>
}
