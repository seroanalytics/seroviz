import {Alert} from "react-bootstrap";
import React from "react";
import {ErrorDetail} from "../generated";

interface Props {
    error: ErrorDetail
    title: string
}

export default function PlotError({error, title}: Props) {
    const message = error.detail ?? `API returned an error: ${error.error}`;
    return <Alert variant={"danger"} className={"rounded-0 border-0 mb-1 ms-4"}>
        <p>Plot of <strong>{title}</strong> could not be generated due to the following error:</p>
        {message} {error.error === "SESSION_EXPIRED" &&
        <a href={"/"}>Re-upload your data to continue.</a>}
    </Alert>
}
