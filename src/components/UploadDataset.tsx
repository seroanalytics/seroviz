import Form from "react-bootstrap/Form";
import {Button, Col} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {ActionType, RootContext, RootDispatchContext} from "../RootContext";
import {DataService} from "../services/dataService";
import {api} from "../services/apiService";
import {isAlphaNumeric} from "../services/utils";

export default function UploadDataset() {
    const state = useContext(RootContext);
    const dispatch = useContext(RootDispatchContext);
    const apiService = api(state.language, dispatch);

    const [timeColumnHeader, setTimeColumnHeader] = useState("day");
    const [dataType, setDataType] = useState("surveillance");
    const [datasetName, setDatasetName] = useState("");
    const [validName, setValidName] = useState(true);
    const [selectedFile, selectFile] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const onSelectTimeColumnHeader = (e: any) => setTimeColumnHeader(e.target.value);
    const onSelectDataType = (e: any) => setDataType(e.target.value);
    const onSelectDatasetName = (e: any) => {
        setDatasetName(e.target.value);
        setValidName(isAlphaNumeric(e.target.value));
    }

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

        dispatch({
            type: ActionType.UPLOAD_ERROR_DISMISSED,
            payload: null
        });

        setIsUploading(true);
        if (!validName) {
            return
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('xcol', timeColumnHeader);
        formData.append('name', datasetName);
        formData.append('series_type', dataType);

        const dataService = new DataService(apiService);

        const result = await dataService.uploadDataset(formData);

        setIsUploading(false);

        if (result) {
            await dataService.getDatasetNames();
        }
    }
    return <Form.Group className={"mb-3"}>
        <h4>Upload new dataset</h4>
        <Form.Control type="file" name="upload-file"
                      data-testid={"upload-file"}
                      id={"upload-file"}
                      disabled={isUploading}
                      onChange={onSelectFile}
                      accept={".csv"}/>
        <Form.Text>
            File must be in CSV format. Required
            columns: biomarker, value.</Form.Text>
        <Form.Group
            className={"row mb-3 mt-3"}>
            <Form.Label column sm={3}>Name</Form.Label>
            <Col sm={6}>
                <Form.Control type={"text"}
                              data-testid={"dataset-name"}
                              placeholder={"dataset name"}
                              onChange={onSelectDatasetName}
                              value={datasetName}
                              className={!validName ? "is-invalid" : ""}/>
                <div className={"invalid-feedback"}>
                    Dataset name can only contain alphanumeric characters and
                    underscores.
                </div>

                <Form.Text>Optional name for this dataset; can only contain
                    alphanumeric characters and underscores. If not specified,
                    the
                    filename will be used.</Form.Text>
            </Col>
        </Form.Group>
        <Form.Group className={"row mb-3"}>
            <Form.Label column sm={3}>Time column</Form.Label>
            <Col sm={6}>
                <Form.Control type={"text"}
                              placeholder={"name of column"}
                              onChange={onSelectTimeColumnHeader}
                              value={timeColumnHeader}/>
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
            </Col>
        </Form.Group>
        <Form.Group className={"row mb-3"}>
            <Form.Label column sm={3}>Time series type</Form.Label>
            <Col sm={6}>
                <Form.Select onChange={onSelectDataType}
                             value={dataType}>
                    <option value={"surveillance"}>surveillance</option>
                    <option value={"post-exposure"}>post-exposure</option>
                </Form.Select>
                <Form.Text>
                Is this an absolute (surveillance) or a relative
                    (post-exposure) time series?
                </Form.Text>
            </Col>
        </Form.Group>
        <div
            className={state.uploadError ? "invalid-feedback d-block" : "d-none"}>
            {state.uploadError && state.uploadError.detail}
        </div>
        <Button key="go-btn" variant="success"
                className={"mt-2 mb-3"}
                disabled={!validName || isUploading}
                type="submit" onClick={uploadNewFile}>Upload
        </Button>
    </Form.Group>
}
