import {between, calculateFacets, toFilename} from "../../src/services/utils";
import {Variable} from "../../src/generated";

describe("plotUtils", () => {

    it("Can calculate facets", () => {
        const facetVariables: Variable[] = [
            {
                name: "sex", levels: ["F", "M"]
            },
            {
                name: "age", levels: ["1", "2"]
            },
            {
                name: "biomarker", levels: ["ab", "ba"]
            }
        ]

        const result = calculateFacets(facetVariables[0].levels, facetVariables[1].levels, facetVariables[2].levels);
        expect(result.length).toBe(8);
        expect(result[0]).toEqual(["F", "1", "ab"])
        expect(result[1]).toEqual(["F", "1", "ba"])
        expect(result[2]).toEqual(["F", "2", "ab"])
        expect(result[3]).toEqual(["F", "2", "ba"])
        expect(result[4]).toEqual(["M", "1", "ab"])
        expect(result[5]).toEqual(["M", "1", "ba"])
        expect(result[6]).toEqual(["M", "2", "ab"])
        expect(result[7]).toEqual(["M", "2", "ba"])
    })

    it("can generate snake case filename", () => {
        expect(toFilename("ab_units sex:F")).toBe("ab_units_sex_f")
        expect(toFilename("ab_units  sex:F")).toBe("ab_units_sex_f")
        expect(toFilename("ab_units  sex:F+age:5+")).toBe("ab_units_sex_f_age_5")
        expect(toFilename("ab_units  ")).toBe("ab_units")
        expect(toFilename("ab_units")).toBe("ab_units")
        expect(toFilename("ABunits")).toBe("abunits")
    })


    it("can bound number by min and max", () => {
        expect(between(1.1, 0, 1)).toBe(1);
        expect(between(-0.1, 0, 1)).toBe(0);
        expect(between(0.1, 0, 1)).toBe(0.1);
    })
});
