import React, {useContext, useState} from "react";
import {RootContext, RootDispatchContext} from "../RootContext";
import {Alert, Col, Row} from "react-bootstrap";
import SideBar from "./SideBar";
import Plot from "react-plotly.js";
import {useDebouncedEffect} from "../hooks/useDebouncedEffect";
import {dataService} from "../services/dataService";
import {ErrorDetail} from "../generated";
import PlotError from "./PlotError";

export function IndividualPlots() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const [data, setData] = useState<any[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [layout, setLayout] = useState<any>(null);
    const [plotError, setPlotError] = useState<ErrorDetail | null>(null);

    const scale = state.datasetSettings[state.selectedDataset].scale;
    const settings = state.datasetSettings[state.selectedDataset].individualSettings
    useDebouncedEffect(() => {

        const fetchData = async () => {
            setPlotError(null);
            setData([]);
            setWarnings([]);
            const result = await dataService(state.language, dispatch)
                .getIndividualData(state.selectedDataset, scale, settings);

            if (result && result.data) {
                const data = result.data.data.filter(d => d.x instanceof Array && d.y instanceof Array);
                const warnings = [result.data.warnings];
                const omittedPanels = result.data.data.length - data.length;
                if (omittedPanels > 0) {
                    warnings.push(omittedPanels + " traces contained single data points and were omitted.")
                }
                setData(data);
                setLayout(result.data.layout);
                setWarnings(warnings.flat().filter(w => w) as string[]);
            }
            if (result && result.errors?.length) {
                setPlotError(result.errors[0])
            }
        }

        if (settings.pid) {
            fetchData();
        }

    }, [state.language, dispatch, state.selectedDataset, scale, settings], 100);

    const title = settings.filter || "individual trajectories";

    return <Row>
        <SideBar/>
        <Col sm={8}>
            <Row className={"pt-3"}>
                {warnings.length > 0 && <Alert className={"rounded-0 border-0 mb-1 ms-4"}
                                      variant={"warning"}>
                    Plot generated some warnings:
                    <ul>{
                        warnings.map(w =>
                            <li key={w}>{w}</li>)}
                    </ul>
                </Alert>}
                {!!plotError && <PlotError title={title} error={plotError}/>}
                {!!settings.pid && data.length > 0 && <Plot data={data}
                                                            layout={{
                                                                ...layout,
                                                                autosize: true
                                                            }}
                                                            useResizeHandler={true}
                                                            style={{
                                                                minWidth: "400px",
                                                                width: "100%",
                                                                height: "800px"
                                                            }}></Plot>
                }
                {!settings.pid &&
                    <p className={"mt-3"}>Please select an id column</p>}
            </Row>
        </Col>
    </Row>
}
