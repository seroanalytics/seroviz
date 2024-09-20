import React, {useContext, useEffect, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {RootContext, RootDispatchContext} from "../RootContext";
import {api} from "../services/apiService";
import {DataService} from "../services/dataService";
import UploadDataset from "./UploadDataset";
import ListDatasets from "./ListDatasets";
import {Info} from "lucide-react";

export function ManageDatasets() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);

    useEffect(() => {
        (new DataService(api(state.language, dispatch)))
            .getDatasetNames();

    }, [state.language, dispatch]);

    return <Row className={"mt-5"}>
        <Col xs={12} sm={{span: 6, offset: 3}}>
            <Form>
                <p><Info className={"me-2"}/>Files you upload are
                    only accessible to you and
                    will be deleted automatically when you close your
                    browser.</p>
                <fieldset>
                    {state.datasetNames.length > 0 &&
                        <ListDatasets/>
                    }
                    <UploadDataset/>
                </fieldset>
            </Form>
        </Col>
    </Row>
}
