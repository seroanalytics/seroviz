import React, {useContext, useState} from "react";
import {RootContext, RootDispatchContext} from "../RootContext";
import {Alert, Col} from "react-bootstrap";
import Plot from "react-plotly.js";
import {useDebouncedEffect} from "../hooks/useDebouncedEffect";
import {dataService} from "../services/dataService";
import {ErrorDetail} from "../generated";
import PlotError from "./PlotError";
import {toFilename} from "../services/utils";
import PageNav from "./PageNav";

export function IndividualPlots() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const [data, setData] = useState<any[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [layout, setLayout] = useState<any>(null);
    const [plotError, setPlotError] = useState<ErrorDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(1);

    const scale = state.datasetSettings[state.selectedDataset].scale;
    const settings = state.datasetSettings[state.selectedDataset].individualSettings
    useDebouncedEffect(() => {

        const fetchData = async () => {
            setPlotError(null);
            setData([]);
            setWarnings([]);
            setLoading(true);
            const result = await dataService(state.language, dispatch)
                .getIndividualData(state.selectedDataset, scale, settings, page, state.selectedDatasetIsPublic);

            if (result && result.data) {
                const data = result.data.data.filter(d => d.x instanceof Array && d.y instanceof Array);
                const warnings = [result.data.warnings];
                const omittedPanels = result.data.data.length - data.length;
                if (omittedPanels === 1) {
                    warnings.push("1 trace contained single data points and was omitted.")
                }
                if (omittedPanels > 1) {
                    warnings.push(omittedPanels + " traces contained single data points and were omitted.")
                }
                setData(data);
                setLayout(result.data.layout);
                setWarnings(warnings.flat().filter(w => w) as string[]);
                setNumPages(result.data.numPages);
            }
            if (result && result.errors?.length) {
                setPlotError(result.errors[0])
            }
            setLoading(false);
        }

        if (settings.pid) {
            fetchData();
        }

    }, [state.language, dispatch, state.selectedDataset, scale, settings, page, state.selectedDatasetIsPublic], 100);

    const title = settings.filter || "individual trajectories";

    return <Col sm={8} className={"mt-2"}>
        {warnings.length > 0 &&
            <Alert className={"rounded-0 border-0 mb-1 ms-4"}
                   variant={"warning"}>
                Plot generated some warnings:
                <ul>{
                    warnings.map(w =>
                        <li key={w}>{w}</li>)}
                </ul>
            </Alert>}
        {loading && <h2>Loading</h2>}
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
                                                    }}
                                                    config={{toImageButtonOptions: {filename: toFilename(title)}}}/>
        }
        {!settings.pid &&
            <p className={"mt-3"}>Please select an id column</p>}
        {!!settings.pid && data.length > 0 &&
            <PageNav currentPage={page} numPages={numPages}
                     setPage={setPage}></PageNav>}
    </Col>
}
