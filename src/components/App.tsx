import React, {useEffect, useReducer} from 'react';
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {ChooseDataset} from "./ChooseDataset";
import usePersistedState from "../hooks/usePersistedState";
import {
    initialState,
    RootContext,
    RootDispatchContext,
    rootReducer
} from "../RootContext";
import {ExploreDataset} from "./ExploreDataset";
import AppError from "./AppError";
import {dataService} from "../services/dataService";

export default function App() {
    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    useEffect(() => {
        if (state.selectedDataset) {
            dataService(state.language, dispatch)
                .getDatasetMetadata(state.selectedDataset);
        }
    }, [state.selectedDataset, state.language, dispatch]);

    return <RootContext.Provider value={state}>
        <RootDispatchContext.Provider value={dispatch}>
            <TopNav theme={theme as string}
                    setTheme={setTheme as (newState: string) => void}></TopNav>
            <AppError/>
            <Container fluid>
                {!state.selectedDataset && <ChooseDataset/>}
                {state.selectedDataset && <ExploreDataset/>}
            </Container>
        </RootDispatchContext.Provider>
    </RootContext.Provider>
}
