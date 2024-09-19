import React, {useEffect, useReducer} from 'react';
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {ChooseOrUploadDataset} from "./ChooseOrUploadDataset";
import usePersistedState from "../hooks/usePersistedState";
import {
    initialState,
    RootContext,
    RootDispatchContext
} from "../RootContext";
import AppError from "./AppError";
import {dataService} from "../services/dataService";
import {rootReducer} from "../reducers/rootReducer";
import ExploreDataset from "./ExploreDataset";

export default function App() {
    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    useEffect(() => {
        if (state.selectedDataset) {
            dataService(state.language, dispatch)
                .getDatasetMetadata(state.selectedDataset);
        }
    }, [state.selectedDataset, state.language, dispatch]);


    useEffect(() => {
        setInterval(() => {
            dataService("en", () => {
            })
                .refreshSession()
        }, 60 * 1000);
    }, []);

    return <RootContext.Provider value={state}>
        <RootDispatchContext.Provider value={dispatch}>
            <TopNav theme={theme as string}
                    setTheme={setTheme as (newState: string) => void}></TopNav>
            {state.genericErrors.map((e, index) => <AppError error={e}
                                                              key={"error" + index}/>)}
            <Container fluid>
                {!state.selectedDataset && <ChooseOrUploadDataset/>}
                <ExploreDataset/>
            </Container>
        </RootDispatchContext.Provider>
    </RootContext.Provider>
}
