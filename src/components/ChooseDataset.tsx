import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {api} from "../services/apiService";
import {DatasetMetadata} from "../types";

export function ChooseDataset() {

    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);
    const apiService = api(state.language, dispatch);

    useEffect(() => {
        api(state.language, dispatch)
            .withSuccess(ActionType.DATASET_NAMES_FETCHED)
            .withError(ActionType.ERROR_ADDED)
            .get<string[]>("/datasets/").then(datasets => {
            if (datasets && datasets.data) {
                selectDataset(datasets.data[0])
            }
        });
    }, [state.language, dispatch]);

    const onSelectData = (event: any) => {
        selectDataset(event.target.value);
    }

    const go = () => {
        dispatch({type: ActionType.DATASET_SELECTED, payload: selectedDataset})
    }

    const [selectedDataset, selectDataset] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [timeColumnHeader, setTimeColumnHeader] = useState("day");
    const [timeColumnName, setTimeColumnName] = useState("Day of study");
    const [selectedFile, selectFile] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const toggleShowOptions = (event: any) => {
        event.preventDefault();
        setShowOptions(!showOptions);
    }
    const onSelectTimeColumnHeader = (e: any) => setTimeColumnHeader(e.target.value);
    const onSelectTimeColumnName = (e: any) => setTimeColumnName(e.target.value);

    const uploadNewFile = async (event: any) => {
        if (event.currentTarget.files.length > 0) {
            const file = event.currentTarget.files[0];

            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            const result = await apiService
                .withError(ActionType.UPLOAD_ERROR_ADDED)
                .postAndReturn<any>("/dataset/", formData);

            setIsUploading(false);
            selectFile("");

            if (result) {
                await apiService
                    .withSuccess(ActionType.DATASET_NAMES_FETCHED)
                    .withError(ActionType.ERROR_ADDED)
                    .get<DatasetMetadata[]>("/datasets/");
            }
        }
    }

    return <Row className={"mt-5"}>
        <Col xs={12} sm={{span: 6, offset: 3}}>
            <Form>
                <fieldset>
                    <Form.Group>
                        <Form.Label htmlFor="data">Choose dataset</Form.Label>
                        <Form.Select id="data" onChange={onSelectData} value={selectedDataset}>
                            {state.datasetNames.map((d: string) =>
                                <option key={d} value={d}>{d}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="success" className={"w-100 mt-2 mb-3"}
                            type="submit" onClick={go}>Go</Button>
                    <h5 className={"text-center text-uppercase"}>or</h5>
                    <Form.Group controlId="formFileSm" className={"mb3"}>
                        <Form.Label>Upload new dataset</Form.Label>
                        <Form.Control type="file" disabled={isUploading}
                                      className={state.uploadError ? " is-invalid" : ""}
                                      value={selectedFile}
                                      onChange={uploadNewFile}
                                      accept={".csv"}/>
                        <div className={"invalid-feedback"}>
                            {state.uploadError && state.uploadError.detail}
                        </div>
                        <Form.Text muted>File must be in CSV format. Required columns: biomarker, value, day</Form.Text>
                        <div className={"d-block mt-2"}>
                            <button className="btn btn-link p-0" onClick={toggleShowOptions}>Advanced options
                                <span className="caret">{String.fromCharCode(showOptions ? 9650 : 9660)}</span>
                            </button>
                        </div>
                        <Form.Group className={showOptions ? "row mb-3" : "d-none"}>
                            <Form.Text muted className={"mb-3"}>
                                Data should be in the form of a time series and by default
                                we expect the indices of this series to be given in a column called 'day'.
                                If you want to index your time series by a different value,
                                e.g. time since last exposure, you can specify that here.
                            </Form.Text>
                            <Form.Label column sm={3}>Time column header</Form.Label>
                            <Col sm={6}>
                                <Form.Control type={"text"} onChange={onSelectTimeColumnHeader}
                                              value={timeColumnHeader}/>
                            </Col>
                        </Form.Group>
                        <Form.Group className={showOptions ? "row" : "d-none"}>
                            <Form.Label column sm={3}>Time column display name</Form.Label>
                            <Col sm={6}>
                                <Form.Control type={"text"} onChange={onSelectTimeColumnName} value={timeColumnName}/>
                            </Col>
                        </Form.Group>
                    </Form.Group>
                </fieldset>
            </Form>
        </Col>
    </Row>
}
