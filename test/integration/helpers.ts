import {readFile} from "node:fs/promises";

export async function getFormData(fileName: string) {
    const filePath = `test/testdata/${fileName}`;
    const formData = new FormData();
    const file = new Blob([await readFile(filePath)], { type: "text/csv" });
    formData.set("file", file, fileName);
    formData.set("xcol", "day");
    formData.set("series_type", "surveillance");
    return formData
}
