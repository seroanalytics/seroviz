import React, {useReducer} from 'react';
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import usePersistedState from "../hooks/usePersistedState";
import {
    initialState,
    RootContext,
    RootDispatchContext
} from "../RootContext";
import {rootReducer} from "../reducers/rootReducer";

export default function NoPage() {

    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    return <RootContext.Provider value={state}>
        <RootDispatchContext.Provider value={dispatch}>
            <TopNav theme={theme as string}
                    setTheme={setTheme as (newState: string) => void}></TopNav>
            <Container fluid>
                <h1>Page not found</h1>
            </Container>
        </RootDispatchContext.Provider>
    </RootContext.Provider>
}
