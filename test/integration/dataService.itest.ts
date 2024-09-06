import {dataService} from "../../src/services/dataService";
import {ActionType} from "../../src/RootContext";
import {GenericResponse} from "../../src/types";
import {DataSeries, DatasetMetadata, DatasetNames} from "../../src/generated";
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
        expect(dispatch.mock.calls.length).toBe(0);
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
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.DATASET_NAMES_FETCHED);
        expect(dispatch.mock.calls[0][0].payload).toEqual(["testpopulation"]);
    });

    test("it can fetch dataset metadata", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDatasetMetadata("testpopulation") as GenericResponse<DatasetMetadata>;
        const expectedPayload = {
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
        expect(dispatch.mock.calls[0][0].type).toBe(ActionType.DATASET_METADATA_FETCHED);
        expect(dispatch.mock.calls[0][0].payload).toEqual(expectedPayload);
    });

    test("it can fetch dataset metadata", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDataSeries("testpopulation", "ab_units", "", [], "natural") as GenericResponse<DataSeries>;
        expect(res.data!![0].name).toBe("all");
        expect(res.data!![0].raw.x).toEqual([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
        expect(dispatch.mock.calls.length).toBe(0);
    });

    test("it can fetch dataset metadata with facet definition", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDataSeries("testpopulation", "ab_units", "sex:F", [], "natural") as GenericResponse<DataSeries>;

        expect(res.data!!.length).toBe(1);
        expect(res.data!![0].name).toBe("sex:F");
        expect(res.data!![0].raw.x).toEqual([1, 2, 1, 2, 1, 2, 1, 2]);
        expect(dispatch.mock.calls.length).toBe(0);
    });

    test("it can fetch dataset metadata with facet definition and trace", async () => {
        const dispatch = jest.fn();
        const sut = dataService("en", dispatch);
        const res = await sut.getDataSeries("testpopulation", "ab_units", "sex:F", [{
            name: "age",
            display: "trace",
            levels: ["0-5"]
        }], "natural") as GenericResponse<DataSeries>;

        expect(res.data!!.length).toBe(2);
        expect(res.data!![0].name).toBe("0-5");
        expect(res.data!![0].raw.x).toEqual([1, 2, 1, 2]);
        expect(res.data!![1].name).toBe("5+");
        expect(res.data!![1].raw.x).toEqual([1, 2, 1, 2]);
        expect(dispatch.mock.calls.length).toBe(0);
    });
});
