import React, {useContext, useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import {RootContext, RootDispatchContext} from "../RootContext";
import {DataService} from "../services/dataService";
import {api} from "../services/apiService";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";

export default function PublicDatasets() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    useEffect(() => {
        (new DataService(api(state.language, dispatch)))
            .getPublicDatasets();

    }, [state.language, dispatch]);

    return <Row className={"mt-5"}>
        <Col xs={12} sm={{span: 6, offset: 3}}>
            <Form>
                <fieldset>
                    <Form.Group key="choose-dataset" className={"mb-5"}>
                        <h4>Public datasets</h4>
                        <p>As well as uploading your own data to the tool, you
                            can explore a publicly available real or simulated
                            dataset:</p>
                        <ul className={"list-unstyled"}>
                            {state.publicDatasets.map(d =>
                                <li key={d.name} className={"mt-4"}>
                                    <Link
                                        to={`/dataset/${d.name}?public=true`}>{d.name}</Link>
                                    <p className="text-muted"
                                       dangerouslySetInnerHTML={{__html: d.description}}></p>
                                </li>)}
                        </ul>
                    </Form.Group>
                </fieldset>
            </Form>
        </Col>
    </Row>
}
