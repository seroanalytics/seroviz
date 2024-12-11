import React, {useReducer} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import TopNav from "./TopNav";
import usePersistedState from "../hooks/usePersistedState";
import {
    initialState,
    RootContext,
    RootDispatchContext
} from "../RootContext";
import {rootReducer} from "../reducers/rootReducer";

export default function FAQ() {

    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    return <RootContext.Provider value={state}>
        <RootDispatchContext.Provider value={dispatch}>
            <TopNav theme={theme as string}
                    setTheme={setTheme as (newState: string) => void}></TopNav>
            <Container fluid>
                <Row className={"mt-5"}>
                    <Col xs={12} sm={{span: 8, offset: 2}}>
                        <h1>FAQ</h1>
                        <ul>
                            <li className={"fw-bold mt-2"}>
                                What format does my data need to be in?
                            </li>
                            <p>Data should be a CSV containing an absolute or
                                relative time series of biomarker values, in
                                long-format.
                                Required columns
                                are <i>biomarker</i> and <i>value</i>,
                                plus a column containing a time variable, the
                                name of which is configurable but defaults
                                to <i>day</i>. Arbitrarily many extra columns
                                are allowed and will be made available to
                                disaggregate by.</p>
                            <li className={"fw-bold mt-2"}>
                                What is the difference between "serological
                                surveillance" and "post-exposure" data?
                            </li>
                            <p>
                                By "serological surveillance" we mean time
                                series
                                data where the time variable is based on
                                absolute
                                calendar date; for example, a study that
                                monitors a population level biomarker over time.
                                The time variable here might be day of study, or
                                calendar date.</p>
                            <p>
                                By "post-exposure" data we mean a relative time
                                series,
                                where biomarker levels are measured for each
                                individual
                                relative to a known exposure (vaccination or
                                infection). The time variable here would be time
                                since exposure.
                            </p>
                            <li className={"fw-bold mt-2"}>
                                Where is my data kept? Is it secure?
                            </li>
                            <p>SeroViz is deployed to Digital Ocean's App
                                Platform; access to the remote server is
                                limited to app maintainers and secured via 2fa.
                                You can read more about Digital
                                Ocean's infrastructure security <a
                                    href={"https://www.digitalocean.com/security/infrastructure-security"}>here</a>.
                            </p>
                            <p>Files are temporarily uploaded to the remote
                                server
                                under a unique session id, and will persist as
                                long as your keep your browser open.
                                When you close your browser all session cookies
                                will be deleted, and remote files associated
                                with inactive sessions are deleted every hour.
                            </p>
                            <p>Or, to force your session and all associated
                                files to be deleted immediately, you can click
                                the "End session" link in the top-right
                                corner.
                            </p>
                            <li className={"fw-bold mt-2"}>
                                Who funded this project? Who maintains it?
                            </li>
                            This project was funded by the Wellcome Trust. It
                            was built
                            by <a href={"https://github.com/hillalex/"}>Alex
                            Hill</a> and is maintained by <a
                            href={"https://github.com/dchodge/"}>David
                            Hodgson</a>.
                            <li className={"fw-bold mt-2"}>
                                How do I request new features?
                            </li>
                            Please raise a GitHub issue on the <a
                            href={"https://github.com/seroanalytics/seroviz"}>seroviz
                            repo</a>.
                        </ul>
                    </Col>
                </Row>
            </Container>
        </RootDispatchContext.Provider>
    </RootContext.Provider>
}
