import React, {useContext, useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {api} from "../services/apiService";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";

interface Props {
    biomarker: string
    facetVariables: string[]
    facetLevels: string[]
}

export default function LinePlot({biomarker, facetVariables, facetLevels}: Props) {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const [seriesData, setSeries] = useState<any>(null);

    const len = facetVariables.length
    const facetDefinitions: string[] = [];
    for (let i = 0; i < len; i++) {
        facetDefinitions.push(`${facetVariables[i]}:${facetLevels[i]}`);
    }

    const facetDefinition= facetDefinitions.join("+")

    const traces = state.selectedCovariates
        .filter(v => v.display === "trace")
        .map(v => v.name).join("+")

    useEffect(() => {
        api(state.language, dispatch)
            .ignoreSuccess()
            .withError(ActionType.ERROR_ADDED)
            .get<any[]>("/dataset/" + state.selectedDataset + "/" + biomarker + "/?facet=" + facetDefinition + "&trace=" + encodeURIComponent(traces))
            .then(data => {
                if (data && data.data) {
                    setSeries(data.data)
                }
            });
    }, [state.language, biomarker, dispatch, facetDefinition, state.selectedDataset, traces]);

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
            title: biomarker + " " + facetDefinition,
            legend: {xanchor: 'center', x: 0.5, orientation: 'h'},
            paper_bgcolor: "rgba(255,255,255, 0)"
        }}
        useResizeHandler={true}
        style={{minWidth: "400px", width: "100%", height: "500"}}
    />
}
