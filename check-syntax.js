import fs from "fs";
import { parse } from "@babel/parser";

const code = fs.readFileSync(new URL("./unravl-engine.js", import.meta.url), "utf8");
parse(code, {
  sourceType: "module",
  plugins: ["jsx"],
});
console.log("syntax OK");
