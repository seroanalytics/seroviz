import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {
    mockAppState,
    mockAxios,
    mockDatasetMetadata,
    mockError, mockFailure, mockSeriesData,
    mockSuccess
} from "../mocks";
import {RootContext, RootDispatchContext} from "../../src/RootContext";
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

        const go = await screen.findByText("Go");
        await userEvent.click(go);

        const biomarkers = await screen.findByText("Detected biomarkers");
        expect(biomarkers.nextSibling?.textContent).toBe("ab");
    });
});
