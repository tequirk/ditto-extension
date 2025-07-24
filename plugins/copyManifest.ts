import * as fs from "fs";
import * as path from "path";
import { Plugin } from "rollup";

export const copyManifest = (): Plugin => {
  return {
    generateBundle() {
      if (!fs.existsSync("./dist")) fs.mkdirSync("./dist");

      fs.copyFileSync(
        path.resolve("./manifest.json"),
        path.resolve("./dist/manifest.json")
      );
    },
    load() {
      this.addWatchFile(path.resolve("./manifest.json"));
      return undefined;
    },
    name: "copy-manifest",
  };
};
