import React, {useEffect, useReducer} from 'react';
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {ChooseDataset} from "./ChooseDataset";
import usePersistedState from "../hooks/usePersistedState";
import {ActionType, initialState, RootContext, RootDispatchContext, rootReducer} from "../RootContext";
import {ExploreDataset} from "./ExploreDataset";
import {api} from "../services/apiService";

export default function App() {
    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    useEffect(() => {
        if (state.selectedDataset) {
            api(state.language, dispatch)
                .withSuccess(ActionType.DATA_FETCHED)
                .withError(ActionType.ERROR_ADDED)
                .get<string[]>("/dataset/" + state.selectedDataset)
        }
    }, [state.selectedDataset, state.language, dispatch]);

    return <RootContext.Provider value={state}>
        <RootDispatchContext.Provider value={dispatch}><Container fluid>
            <TopNav theme={theme as string} setTheme={setTheme as (newState: string) => void}></TopNav>
            {!state.selectedDataset && <ChooseDataset/>}
            {state.selectedDataset && <ExploreDataset/>}
        </Container></RootDispatchContext.Provider>
    </RootContext.Provider>
}
