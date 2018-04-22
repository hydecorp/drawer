#!/usr/bin/env node

const { promisify } = require("util");
const { dirname, relative, resolve } = require("path");
const fs = require("fs");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DOCS = [
  resolve(`./example/README.md`),
  resolve(`./licenses/README.md`),
  resolve(`./usage/README.md`),
  resolve(`./doc/README.md`),
];

const INC_HEADING_REGEX = /^(#+\s+.*)/gmu;

const RE_LINK = /\[([^\]]+?)\]\((?!http)([^.][^)]+?)\)/gmu;
const RE_DIR = /\[([^\]]+?)\]\(\.\/([^)]+?)\)/gmu;
const RE_PARENT = /\[([^\]]+?)\]\(\.\.\/([^)]+?)\)/gmu;

const RE_REF_LINK = /\[([^\]]+?)\]:\s+((?!http)[^.][^)]+?)/gmu;
const RE_REF_DIR = /\[([^\]]+?)\]:\s+\.\/([^)]+?)/gmu;
const RE_REF_PARENT = /\[([^\]]+?)\]:\s+\.\.\/([^)]+?)/gmu;

(async function main() {
  try {
    const baseFile =
      (await readFile(resolve("./README.md"), "utf8")).split("<!--more-->")[0] + "<!--more-->";

    const readme = await DOCS.map(async f => [f, await readFile(f, "utf-8")])
      .map(async p => {
        const [f, fileContent] = await p;
        const bname = relative(resolve(), dirname(f));

        const content = fileContent
          .split("<!--more-->")[0]
          .replace(INC_HEADING_REGEX, "#$1")
          .replace(RE_LINK, `[$1](${bname}/$2)`)
          .replace(RE_DIR, `[$1](./${bname}/$2)`)
          .replace(RE_PARENT, `[$1]($2)`)
          .replace(RE_REF_LINK, `[$1]: ${bname}/$2`)
          .replace(RE_REF_DIR, `[$1]: ./${bname}/$2`)
          .replace(RE_REF_PARENT, `[$1]: $2`)
          .trim();

        return content;
      })
      .reduce(async (base, content) => `${await base}\n\n${await content}\n`, baseFile);

    await writeFile(resolve(`./README.md`), readme, "utf-8");

    process.exit(0);
  } catch (e) {
    console.error(e); // eslint-disable-line
    process.exit(1);
  }
})();
