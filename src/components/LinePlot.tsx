import React, {useContext, useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {RootContext, RootDispatchContext} from "../RootContext";
import {DataSeries} from "../generated";
import {dataService} from "../services/dataService";

interface Props {
    biomarker: string
    facetVariables: string[]
    facetLevels: string[]
}

const colors = [
    '#1f77b4',  // muted blue
    '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#d62728',  // brick red
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf'   // blue-teal
];

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

    const covariateSettings = state.datasetSettings[state.selectedDataset].covariateSettings;
    const scale = state.datasetSettings[state.selectedDataset].scale;
    useEffect(() => {
        const fetchData = async () => {
            const result = await dataService(state.language, dispatch)
                .getDataSeries(state.selectedDataset,
                    biomarker, facetDefinition, covariateSettings, scale);

            if (result && result.data) {
                setSeries(result.data)
            }

            else {
                setSeries(null)
            }
        }
        fetchData();
    }, [state.language, dispatch, state.selectedDataset, biomarker, facetDefinition, covariateSettings, scale]);

    let series: any[] = [];

    if (seriesData) {
        series = seriesData.flatMap((series, index) => ([{
            x: series.model.x,
            y: series.model.y,
            name: series.name,
            legendgroup: series.name,
            type: "scatter",
            mode: "line",
            line: {shape: 'spline', width: 2},
            showlegend: seriesData.length > 1,
            marker: {color: colors[index]}
        },
            {
                x: series.raw.x,
                y: series.raw.y,
                name: series.name,
                legendgroup: series.name,
                type: "scatter",
                mode: "markers",
                showlegend: false,
                marker: {color: colors[index], opacity: 0.5}
            }]))
    } else {
        series = []
    }

    return <Plot
        data={series}
        layout={{
            title: biomarker + " " + facetDefinition,
            legend: {xanchor: 'center', orientation: 'v'},
            paper_bgcolor: "rgba(255,255,255, 0)",
            xaxis: {
                title: {
                    text: state.datasetMetadata?.xcol
                }
            }
        }}
        useResizeHandler={true}
        style={{minWidth: "400px", width: "100%", height: "500"}}
    />
}
