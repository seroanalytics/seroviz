import {useContext} from "react";
import {RootContext} from "../RootContext";
import {Col, Row} from "react-bootstrap";
import SideBar from "./SideBar";
import LinePlot from "./LinePlot";
import {calculateFacets} from "../services/plotUtils";

export function ExploreDataset() {

    const state = useContext(RootContext);

    const facetVariables = state.selectedCovariates
        .filter(v => v.display === "facet");

    const allFacetLevels = facetVariables.map(f => f.levels);
    let facetLevels: string[][] = [];
    if (allFacetLevels.length > 0) {
        facetLevels = calculateFacets(allFacetLevels.shift() as any, allFacetLevels.shift() as any, ...allFacetLevels as any);
    }

    if (facetLevels.length === 0) {
        return <Row>
            <SideBar/>
            <Col sm={8}>
                {state.datasetMetadata && state.datasetMetadata.biomarkers.map(b => <Row key={b}>
                    <Col>
                        <LinePlot biomarker={b}
                                  facetVariables={facetVariables.map(v => v.name)}
                                  facetLevels={[]}/>
                    </Col>
                </Row>)}
            </Col>
        </Row>
    }

    return <Row>
        <SideBar/>
        <Col sm={8}>
            {state.datasetMetadata && state.datasetMetadata.biomarkers.map(b => <Row key={b}>
                {facetLevels.map((l, i) => <LinePlot biomarker={b}
                                                     key={b + i}
                                                     facetVariables={facetVariables.map(v => v.name)}
                                                     facetLevels={l}/>)}
            </Row>)}
        </Col>
    </Row>
}
