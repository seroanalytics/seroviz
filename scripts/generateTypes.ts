import { compileFromFile } from "json-schema-to-typescript";
import * as fs from "fs";
import path from "path";

const branchName = process.argv[2];
const dir = `/tmp/seroviz/serovizr-${branchName}/inst/schema`;

fs.readdir(dir, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(function (file) {
        if (file.endsWith(".schema.json")) {
            const filePath = path.join(dir, file);
            const typeName = file.split(".")[0];
            try {
                compileFromFile(filePath, {cwd: dir, bannerComment: ""})
                    .then(ts => fs.writeFileSync(`/tmp/seroviz/types/${typeName}.d.ts`, ts));
            } catch (e) {
                console.log(e);
            }
        }
    });
});
