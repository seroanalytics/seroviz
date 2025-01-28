import React, {useContext, useState} from 'react';
import Plot from 'react-plotly.js';
import {RootContext, RootDispatchContext} from "../RootContext";
import {DataSeries, ErrorDetail} from "../generated";
import {dataService} from "../services/dataService";
import {toFilename} from "../services/utils";
import {useDebouncedEffect} from "../hooks/useDebouncedEffect";
import PlotError from "./PlotError";
import PlotWarnings from "./PlotWarnings";
import {Dict} from "../types";

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
    const [plotError, setPlotError] = useState<ErrorDetail | null>(null);

    const len = facetVariables.length
    const facetDefinitions: string[] = [];
    for (let i = 0; i < len; i++) {
        facetDefinitions.push(`${facetVariables[i]}:${facetLevels[i]}`);
    }

    const facetDefinition = facetDefinitions.join("+")

    const covariateSettings = state.datasetSettings[state.selectedDataset].covariateSettings;
    const scale = state.datasetSettings[state.selectedDataset].scale;
    const splineSettings = state.datasetSettings[state.selectedDataset].splineSettings;
    useDebouncedEffect(() => {
        setPlotError(null);
        const fetchData = async () => {
            const result = await dataService(state.language, dispatch)
                .getDataSeries(state.selectedDataset,
                    biomarker, facetDefinition, covariateSettings, scale, splineSettings, state.selectedDatasetIsPublic);

            if (result && result.data) {
                setSeries(result.data)
            } else {
                setSeries(null)
            }
            if (result && result.errors?.length) {
                setPlotError(result.errors[0])
            }
        }
        fetchData();
    }, [state.language, dispatch, state.selectedDataset, biomarker, facetDefinition, covariateSettings, scale, splineSettings, state.selectedDatasetIsPublic], 100);

    let series: any[] = [];
    const warnings: Dict<string[]> = {};

    if (seriesData) {
        series = seriesData.flatMap((series, index) => {
            const name = series.name || "unknown";
            if (series.warnings && series.warnings.length > 0) {
                warnings[name] = series.warnings;
            }
            return [{
                x: series.model?.x || [],
                y: series.model?.y || [],
                name: name,
                legendgroup: name,
                type: "scatter",
                mode: "line",
                line: {shape: 'spline', width: 2},
                showlegend: false,
                marker: {color: colors[index]}
            },
                {
                    x: series.raw.x,
                    y: series.raw.y,
                    name: name,
                    legendgroup: name,
                    type: "scatter",
                    mode: "markers",
                    showlegend: seriesData.length > 1,
                    marker: {color: colors[index], opacity: 0.5}
                }]
        })
    } else {
        series = []
    }

    let title = biomarker;
    if (facetDefinition) {
        title += " " + facetDefinition
    }

    return <div>{series.length > 0 && <Plot
        data={series}
        layout={{
            title: title,
            legend: {xanchor: 'center', orientation: 'v'},
            xaxis: {
                title: {
                    text: state.datasetMetadata?.xcol
                }
            },
            yaxis: {
                title: {
                    text: scale === "natural" ? "value" : `${scale} value`
                }
            }
        }}
        config={{toImageButtonOptions: {filename: toFilename(title)}}}
        useResizeHandler={true}
        style={{minWidth: "400px", width: "100%", height: "500"}}
    />}{plotError &&
        <PlotError title={facetDefinition} error={plotError}/>
    } <PlotWarnings warnings={warnings}/>
    </div>
}
