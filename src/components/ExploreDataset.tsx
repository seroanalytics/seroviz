import React, {useContext} from "react";
import {RootContext} from "../RootContext";
import {PopulationPlots} from "./PopulationPlots";
import {IndividualPlots} from "./IndividualPlots";

export default function ExploreDataset() {
    const state = useContext(RootContext);
    if (!state.selectedDataset) {
        return null
    }
    if (state.selectedPlot === "population") {
        return <PopulationPlots/>
    } else {
        return <IndividualPlots/>
    }
}
