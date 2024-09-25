import React from "react";
import {render, screen} from "@testing-library/react";
import {
    mockAxios,
    mockDatasetMetadata,
    mockFailure, mockSeriesData,
    mockSuccess
} from "../mocks";
import App from "../../src/components/App";
import {userEvent} from "@testing-library/user-event";

describe("<App />", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("should display any generic errors", async () => {
        mockAxios.onGet("/datasets/")
            .reply(404, mockFailure("bad"));

        render(<App/>);
        const errors = await screen.findAllByRole("alert");
        expect(errors.length).toBe(2);
    });

    test("should fetch dataset metadata if dataset selected", async () => {
        mockAxios.onGet("/datasets/")
            .reply(200, mockSuccess(["d1"]));

        mockAxios.onGet("/dataset/d1/")
            .reply(200, mockSuccess(mockDatasetMetadata()));

        mockAxios.onGet("/dataset/d1/trace/ab/?scale=natural")
            .reply(200, mockSuccess(mockSeriesData()));

        render(<App/>);

        const link = await screen.findByText("d1");
        await userEvent.click(link);

        const biomarkers = await screen.findByText("Detected biomarkers");
        expect(biomarkers.parentNode?.textContent).toBe("Detected biomarkers ab");
    });
});
