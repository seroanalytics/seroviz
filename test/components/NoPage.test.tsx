import React from "react";
import {render, screen} from "@testing-library/react";
import NoPage from "../../src/components/NoPage";

describe("<NoPage />", () => {
    test("renders page not found message", async () => {

        render(<NoPage/>);
        const message = await screen.findByRole("heading");
        expect(message.textContent).toBe("Page not found");
    });
});
