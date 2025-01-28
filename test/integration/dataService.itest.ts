import {dataService} from "../../src/services/dataService";
import {ActionType} from "../../src/RootContext";
import {GenericResponse} from "../../src/types";
import {
    DataSeries,
    DatasetMetadata,
    DatasetNames,
    Plotly, PublicDatasets
} from "../../src/generated";
import {getFormData} from "./helpers";

const exec = require('child_process').exec;

describe("DataService", () => {

    beforeAll(async () => {
        exec("docker exec serovizr rm uploads/testpopulation -rf");
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const formData = await getFormData("testpopulation.csv");
        const res = await sut.uploadDataset(formData) as GenericResponse<DatasetNames>;
        expect(res.data).toEqual("testpopulation");
        expect(dispatch.mock.calls.length).toBe(1);
    });

    test("it can fetch root", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.refreshSession() as GenericResponse<string>;
        expect(res.data).toEqual("Welcome to serovizr");
    });

    test("it can fetch dataset names", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDatasetNames() as GenericResponse<DatasetNames>;
        expect(res.data).toEqual(["testpopulation"]);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.DATASET_NAMES_FETCHED);
        expect(dispatch.mock.calls[1][0].payload).toEqual(["testpopulation"]);
    });

    test("it can fetch dataset metadata", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDatasetMetadata("testpopulation", false) as GenericResponse<DatasetMetadata>;
        const expectedPayload = {
            type: "surveillance",
            variables: [
                {
                    name: "sex",
                    levels: ["F", "M"]
                },
                {
                    name: "age",
                    levels: ["0-5", "5+"]
                }],
            biomarkers: ["ab_units"],
            xcol: "day"
        }
        expect(res.data).toEqual(expectedPayload);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.DATASET_METADATA_FETCHED);
        expect(dispatch.mock.calls[1][0].payload).toEqual(expectedPayload);
    });

    test("it can fetch public dataset metadata", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDatasetMetadata("antia2018", true) as GenericResponse<DatasetMetadata>;
        expect(res.data!!.xcol).toEqual("age");
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.DATASET_METADATA_FETCHED);
        expect(dispatch.mock.calls[1][0].payload.xcol).toEqual("age");
    });

    test("it can fetch data series", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDataSeries("testpopulation", "ab_units", "", [], "natural",
            {
                method: "auto",
                span: 0.75,
                k: 10
            }, false) as GenericResponse<DataSeries>;
        expect(res.data!![0].name).toBe("all");
        expect(res.data!![0].raw.x).toEqual([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
        expect(dispatch.mock.calls.length).toBe(1);
    });

    test("it can fetch data series with facet definition", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDataSeries("testpopulation", "ab_units", "sex:F", [], "natural",
            {
                method: "auto",
                span: 0.75,
                k: 10
            }, false) as GenericResponse<DataSeries>;

        expect(res.data!!.length).toBe(1);
        expect(res.data!![0].name).toBe("sex:F");
        expect(res.data!![0].raw.x).toEqual([1, 2, 1, 2, 1, 2, 1, 2]);
        expect(dispatch.mock.calls.length).toBe(1);
    });

    test("it can fetch data series with facet definition and trace", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDataSeries("testpopulation", "ab_units", "sex:F", [{
            name: "age",
            display: "trace",
            levels: ["0-5"]
        }], "natural", {
            method: "auto",
            span: 0.75,
            k: 10
        }, false) as GenericResponse<DataSeries>;

        expect(res.data!!.length).toBe(2);
        expect(res.data!![0].name).toBe("0-5");
        expect(res.data!![0].raw.x).toEqual([1, 2, 1, 2]);
        expect(res.data!![1].name).toBe("5+");
        expect(res.data!![1].raw.x).toEqual([1, 2, 1, 2]);
        expect(dispatch.mock.calls.length).toBe(1);
    });

    test("it can fetch individual plot data", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getIndividualData("testpopulation", "natural",
            {
                color: "age",
                linetype: "biomarker",
                pid: "day",
                filter: "sex:M"
            }, 1, false) as GenericResponse<Plotly>;

        expect(res.data!!.data.length).toBe(4);
        expect(res.data!!.data.map(d => d.name)).toEqual([
            "(0-5,ab_units)",
            "(0-5,ab_units)",
            "(5+,ab_units)",
            "(5+,ab_units)"])
        expect(dispatch.mock.calls.length).toBe(1);
    });

    test("it can fetch individual plot data from public data", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getIndividualData("sim", "natural",
            {
                color: "biomarker",
                linetype: "biomarker",
                pid: "id",
                filter: ""
            }, 1, true) as GenericResponse<Plotly>;

        expect(res.data!!.data.length).toBe(20);
        expect(dispatch.mock.calls.length).toBe(1);
    });

    test("it can fetch public data series", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDataSeries("sim", "sVNT", "", [], "natural", {
            method: "auto",
            span: 0.75,
            k: 10
        }, true) as GenericResponse<DataSeries>;

        expect(res.data!![0].name).toBe("all");
        expect(dispatch.mock.calls.length).toBe(1);
    });

    test("it can fetch public datasets", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getPublicDatasets() as GenericResponse<PublicDatasets>;

        expect(res.data!![0].name).toBe("antia2018");
        expect(res.data!![0].description.length).toBeGreaterThan(0);
        expect(dispatch.mock.calls[1][0].type).toBe(ActionType.PUBLIC_DATASETS_FETCHED);
    });

});
