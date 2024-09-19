import React, {useContext, useState} from "react";
import {RootContext, RootDispatchContext} from "../RootContext";
import {Alert, Col, Row} from "react-bootstrap";
import SideBar from "./SideBar";
import Plot from "react-plotly.js";
import {useDebouncedEffect} from "../hooks/useDebouncedEffect";
import {dataService} from "../services/dataService";

export function IndividualPlots() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const [data, setData] = useState<any[]>([]);
    const [warnings, setWarnings] = useState<string[] | string>("");
    const [layout, setLayout] = useState<any>(null);

    const scale = state.datasetSettings[state.selectedDataset].scale;
    const settings = state.datasetSettings[state.selectedDataset].individualSettings
    useDebouncedEffect(() => {

        const fetchData = async () => {
            setData([]);
            setWarnings("");
            const result = await dataService(state.language, dispatch)
                .getIndividualData(state.selectedDataset, scale, settings);

            console.log(result?.data)
            if (result && result.data) {
                setData(result.data.data)
                setLayout(result.data.layout)
                setWarnings(result.data.warnings)
            }
        }

        if (settings.pid) {
            fetchData();
        }

    }, [state.language, dispatch, state.selectedDataset, scale, settings], 100);

    return <Row>
        <SideBar/>
        <Col sm={8}>
            <Row>
                {!!warnings && <Alert variant={"warning"}>{warnings}</Alert>}
                {!!settings.pid && data.length > 0 && <Plot data={data} layout={{...layout, autosize: true}}
                      useResizeHandler={true}
                      style={{
                          minWidth: "400px",
                          width: "100%",
                          height: "800px"
                      }}></Plot>
                }
                {!settings.pid && <p className={"mt-3"}>Please select an id column</p>}
            </Row>
        </Col>
    </Row>
}
