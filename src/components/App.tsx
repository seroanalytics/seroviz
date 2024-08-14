import React, {useEffect, useReducer} from 'react';
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {ChooseDataset} from "./ChooseDataset";
import usePersistedState from "../hooks/usePersistedState";
import {ActionType, initialState, RootContext, RootDispatchContext, rootReducer} from "../RootContext";
import {ExploreDataset} from "./ExploreDataset";
import {api} from "../services/apiService";
import AppError from "./AppError";

export default function App() {
    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    useEffect(() => {
        if (state.selectedDataset) {
            api(state.language, dispatch)
                .withSuccess(ActionType.DATASET_METADATA_FETCHED)
                .withError(ActionType.ERROR_ADDED)
                .get<string[]>("/dataset/" + state.selectedDataset)
        }
    }, [state.selectedDataset, state.language, dispatch]);

    return <RootContext.Provider value={state}>
        <RootDispatchContext.Provider value={dispatch}>
            <TopNav theme={theme as string} setTheme={setTheme as (newState: string) => void}></TopNav>
            <AppError/>
            <Container fluid>
                {!state.selectedDataset && <ChooseDataset/>}
                {state.selectedDataset && <ExploreDataset/>}
            </Container>
        </RootDispatchContext.Provider>
    </RootContext.Provider>
}
