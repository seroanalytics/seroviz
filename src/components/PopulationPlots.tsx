import {useContext} from "react";
import {RootContext} from "../RootContext";
import {Col, Row} from "react-bootstrap";
import LinePlot from "./LinePlot";
import {calculateFacets} from "../services/utils";

export function PopulationPlots() {

    const state = useContext(RootContext);

    const facetVariables = state.datasetSettings[state.selectedDataset]
        .covariateSettings
        .filter(v => v.display === "facet");

    const allFacetLevels = facetVariables.map(f => f.levels);
    let facetLevels: string[][] = [];
    if (allFacetLevels.length > 0) {
        facetLevels = calculateFacets(allFacetLevels.shift() as any,
            allFacetLevels.shift() as any,
            ...allFacetLevels as any);
    }

    if (facetLevels.length === 0) {
        return <Col sm={8}>
                {state.datasetMetadata && state.datasetMetadata.biomarkers.map(b =>
                    <Row key={b}>
                        <Col>
                            <LinePlot biomarker={b}
                                      facetVariables={[]}
                                      facetLevels={[]}/>
                        </Col>
                    </Row>)}
            </Col>
    }

    return <Col sm={8}>
            {state.datasetMetadata && state.datasetMetadata.biomarkers.map(b =>
                <Row key={b}>
                    {facetLevels.map((l, i) => <LinePlot biomarker={b}
                                                         key={b + i}
                                                         facetVariables={facetVariables.map(v => v.name)}
                                                         facetLevels={l}/>)}
                </Row>)}
        </Col>
}
