import React, {useContext, useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {api} from "../services/apiService";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {DataSeries} from "../generated";

interface Props {
    biomarker: string
    facetVariables: string[]
    facetLevels: string[]
}

export default function LinePlot({
                                     biomarker,
                                     facetVariables,
                                     facetLevels
                                 }: Props) {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    const [seriesData, setSeries] = useState<DataSeries | null>(null);

    const len = facetVariables.length
    const facetDefinitions: string[] = [];
    for (let i = 0; i < len; i++) {
        facetDefinitions.push(`${facetVariables[i]}:${facetLevels[i]}`);
    }

    const facetDefinition = facetDefinitions.join("+")

    const traces = state.selectedCovariates
        .filter(v => v.display === "trace")
        .map(v => v.name).join("+")

    useEffect(() => {
        api(state.language, dispatch)
            .ignoreSuccess()
            .withError(ActionType.ERROR_ADDED)
            .get<DataSeries>("/dataset/" + state.selectedDataset + "/" + biomarker + "/?facet=" + facetDefinition + "&trace=" + encodeURIComponent(traces))
            .then(data => {
                if (data && data.data) {
                    setSeries(data.data)
                }
            });
    }, [state.language, biomarker, dispatch, facetDefinition, state.selectedDataset, traces]);

    let series: any[] = [];
    if (seriesData) {
        series = seriesData.flatMap((series) => ([{
            x: series.model.x,
            y: series.model.y,
            name: series.name,
            legendgroup: series.name,
            type: "scatter",
            mode: "line",
            line: {shape: 'spline', width: 2},
        },
            {
                x: series.raw.x,
                y: series.raw.y,
                name: series.name,
                legendgroup: series.name,
                type: "scatter",
                mode: "markers"
            }]))
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
