import {Alert, Button} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootDispatchContext} from "../RootContext";
import {ErrorDetail} from "../generated";

interface Props {
    error: ErrorDetail
}

export default function AppError({error}: Props) {
    const dispatch = useContext(RootDispatchContext);
    const message = error.detail ?? `API returned an error: ${error.error}`;
    const remove = () => {
        dispatch({type: ActionType.ERROR_DISMISSED, payload: error});
    }
    return <Alert variant={"danger"} className={"rounded-0 border-0 mb-1"}>
        <Button variant={"close"} role={"close"} onClick={remove}
                className={"mx-2 float-end"}></Button>
        {message} {error.error === "SESSION_EXPIRED" && <a href={"/"}>Re-upload your data to continue.</a>}
    </Alert>
}
