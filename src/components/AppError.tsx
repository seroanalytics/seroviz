import {Alert, Button} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";

export default function AppError() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);
    const remove = () => {
        dispatch({type: ActionType.ERROR_DISMISSED, payload: null});
    }
    if (state.genericError) {
        return <Alert variant={"danger"} className={"rounded-0 border-0"}>
            <Button variant={"close"} role={"close"} onClick={remove} className={"mx-2 float-end"}></Button>
            {state.genericError.detail ?? `API returned an error: ${state.genericError.error}`}
        </Alert>
    } else return null
}
