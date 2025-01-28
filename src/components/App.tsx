import React, {useEffect, useReducer} from 'react';
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
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
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FAQ from "./FAQ";
import NoPage from "./NoPage";
import PublicDatasets from "./PublicDatasets";
import {ManageDatasets} from "./ManageDatasets";

export default function App() {
    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

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
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ManageDatasets />} />
                    <Route path="/dataset/:name" element={<ExploreDataset isPublic={false}/>} />
                    <Route path="/dataset/public/:name" element={<ExploreDataset isPublic={true}/>} />
                    <Route path="/public" element={<PublicDatasets />} />
                    <Route path="FAQ" element={<FAQ />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
            </Container>
        </RootDispatchContext.Provider>
    </RootContext.Provider>
}
