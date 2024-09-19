import {Alert} from "react-bootstrap";
import React from "react";
import {Dict} from "../types";

interface Props {
    warnings: Dict<string[]>
}

export default function PlotWarnings({warnings}: Props) {
    const keys = Object.keys(warnings);
    if (keys.length === 0) {
        return null;
    }
    return <Alert variant={"warning"}
                  className={"rounded-0 border-0 mb-1 ms-4"}>
        <p>Some traces generated warnings</p>
        {keys.map((k, i) => <div key={"w" + i}>{k}:
            <ul>{
                warnings[k].map(w =>
                    <li key={w}>{w}</li>)}
            </ul>
        </div>)}
    </Alert>
}
