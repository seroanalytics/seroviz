import React from "react";
import {render, screen} from "@testing-library/react";
import FAQ from "../../src/components/FAQ";

describe("<FAQ />", () => {
    test("renders FAQ", async () => {

        render(<FAQ/>);
        const list = await screen.findAllByRole("listitem");
        expect(list.length).toBe(5);
    });
});
