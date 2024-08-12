import React, {useReducer} from 'react';
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {ChooseDataset} from "./ChooseDataset";
import usePersistedState from "../hooks/usePersistedState";
import {initialState, RootContext, RootDispatchContext, rootReducer} from "../RootContext";

export default function App() {
    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    return <RootContext.Provider value={state}>
        <RootDispatchContext.Provider value={dispatch}><Container fluid>
            <TopNav theme={theme as string} setTheme={setTheme as (newState: string) => void}></TopNav>
            {!state.selectedDataset && <ChooseDataset/>}
            {state.selectedDataset && <div>GRAPHS HERE</div>}
        </Container></RootDispatchContext.Provider>
    </RootContext.Provider>
}
