import Form from "react-bootstrap/Form";
import SplineOptions from "./SplineOptions";
import CovariateOptions from "./CovariateOptions";
import SelectedCovariate from "./SelectedCovariate";
import React, {useContext} from "react";
import {RootContext} from "../RootContext";

export default function PopulationOptions() {
    const state = useContext(RootContext);

    if (state.selectedPlot !== "population") {
        return null
    }

    const selectedCovariates = state.datasetSettings[state.selectedDataset]
        .covariateSettings
        .map(v => v.name);

    const availableCovariates = state.datasetMetadata?.variables
        .filter(v => v.levels.length < 30 && selectedCovariates.indexOf(v.name) === -1) ?? [];

    return <fieldset>
        <Form.Label>
            Spline options
        </Form.Label>
        <SplineOptions/>
        {availableCovariates.length > 0 &&
            <Form.Group className="mb-3">
                <Form.Label>Disaggregate by</Form.Label>
                <CovariateOptions covariates={availableCovariates}/>
            </Form.Group>
        }
        <Form.Group className="mb-3">
            {state.datasetSettings[state.selectedDataset]
                .covariateSettings
                .map(v =>
                    <SelectedCovariate
                        key={v.name}
                        covariate={v}/>)}
        </Form.Group>
    </fieldset>
}
