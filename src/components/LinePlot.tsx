import React, {useContext, useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {api} from "../services/apiService";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";

interface Props {
    biomarker: string
    facetVariable: string
    facetLevel: string
}

export default function LinePlot({biomarker, facetVariable, facetLevel}: Props) {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const [seriesData, setSeries] = useState<any>(null)

    useEffect(() => {
        const facetDefinition = `${facetVariable}:${facetLevel}`;
        api(state.language, dispatch)
            .ignoreSuccess()
            .withError(ActionType.ERROR_ADDED)
            .get<any[]>("/dataset/" + state.selectedDataset + "/" + biomarker + "/" + facetDefinition)
            .then(data => {
                if (data && data.data) {
                    setSeries(data.data)
                }
            });
    }, [state.language, biomarker, dispatch, facetVariable, facetLevel, state.selectedDataset]);

    let series: any[] = [];
    if (seriesData) {
        series = Object.keys(seriesData["model"]).map((key: string) => ({
            x: (seriesData["model"][key as any]).x,
            y: (seriesData["model"][key as any]).y,
            name: key,
            legendgroup: key,
            type: "scatter",
            mode: "line",
            line: {shape: 'spline', width: 2},
        } as any)).concat(Object.keys(seriesData["raw"]).map((key: string) => ({
            x: (seriesData["raw"][key as any]).x,
            y: (seriesData["raw"][key as any]).y,
            name: key,
            legendgroup: key,
            type: "scatter",
            mode: "markers",
        })))
    }

    return <Plot
        data={series}
        layout={{
            legend: {xanchor: 'center', x: 0.5, orientation: 'h'},
            paper_bgcolor: "rgba(255,255,255, 0)"
        }}
        useResizeHandler={true}
        style={{minWidth: "400px", width: "100%", height: "500"}}
    />
}
