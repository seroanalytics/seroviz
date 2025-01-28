import React, {useContext, useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import {RootContext, RootDispatchContext} from "../RootContext";
import {dataService} from "../services/dataService";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";
import {DownloadIcon, ExternalLinkIcon} from "lucide-react";

declare let apiUrl: string;

export default function PublicDatasets() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    useEffect(() => {
        (dataService(state.language, dispatch))
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
                                    <h5>{d.name}</h5>
                                    <Link
                                        to={`/dataset/public/${d.name}/`}>View<ExternalLinkIcon
                                        className={"ms-1"}
                                        style={{marginTop: "-5px"}}></ExternalLinkIcon></Link> /
                                    <a href={`${apiUrl}/public/dataset/${d.name}`}
                                       className={"ps-1"}>Download<DownloadIcon
                                        className={"ms-1"}
                                        style={{marginTop: "-5px"}}></DownloadIcon></a>
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
