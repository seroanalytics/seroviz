import Form from "react-bootstrap/Form";
import {Button, Col} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {DataService} from "../services/dataService";
import {api} from "../services/apiService";

export default function UploadDataset() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);
    const apiService = api(state.language, dispatch);

    const [timeColumnHeader, setTimeColumnHeader] = useState("day");
    const [datasetName, setDatasetName] = useState("");
    const [selectedFile, selectFile] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const onSelectTimeColumnHeader = (e: any) => setTimeColumnHeader(e.target.value);
    const onSelectDatasetName = (e: any) => setDatasetName(e.target.value);

    const onSelectFile = (event: any) => {
        if (event.currentTarget.files?.length) {
            dispatch({
                type: ActionType.UPLOAD_ERROR_DISMISSED,
                payload: null
            });
            const file = event.currentTarget.files[0];
            selectFile(file);
            setDatasetName(file.name.replace(".csv", ""));
        }
    }

    const uploadNewFile = async (event: any) => {

        event.preventDefault();
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('xcol', timeColumnHeader);

        const dataService = new DataService(apiService);

        const result = await dataService.uploadDataset(formData);

        setIsUploading(false);

        if (result) {
            await dataService.getDatasetNames();
        }
    }
    return <Form.Group className={"mb3"}>
        <h4>Upload new dataset</h4>
        <Form.Control type="file" name="upload-file"
                      data-testid={"upload-file"}
                      id={"upload-file"}
                      disabled={isUploading}
                      className={state.uploadError ? " is-invalid" : ""}
                      onChange={onSelectFile}
                      accept={".csv"}/>
        <div className={"invalid-feedback"}>
            {state.uploadError && state.uploadError.detail}
        </div>
        <Form.Text muted>
            File must be in CSV format. Required
            columns: biomarker, value.</Form.Text>
        <Form.Group className={"row my-3"}>
            <Form.Label column sm={3}>Name</Form.Label>
            <Col sm={6}>
                <Form.Control type={"text"}
                              placeholder={"dataset name"}
                              onChange={onSelectDatasetName}
                              value={datasetName}/>
            </Col>
        </Form.Group>
        <Form.Group className={"row mb-3"}>
            <Form.Label column sm={3}>Time column</Form.Label>
            <Col sm={6}>
                <Form.Control type={"text"}
                              onChange={onSelectTimeColumnHeader}
                              value={timeColumnHeader}/>
            </Col>
            <Form.Text>
                Data should be in the form of a time series
                and
                by default
                we expect the indices of this series to be
                given
                in a column called 'day'.
                If you want to index your time series by a
                different value,
                e.g. time since last exposure, you can
                specify
                that here. Numeric and date type values are
                supported.
            </Form.Text>
        </Form.Group>
        <Button key="go-btn" variant="success"
                className={"mt-2 mb-3"}
                type="submit" onClick={uploadNewFile}>Upload
        </Button>
    </Form.Group>
}