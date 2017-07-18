#!/usr/bin/env node

// This script takes all `.js` and `.jsx` source files from `src`,
// runs them through `docco` and puts the results in `doc/src`.

const { promisify } = require('util');
const { basename, dirname, extname, relative, resolve } = require('path');
const fs = require('fs');
const docco = promisify(require('docco').document);

const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);

const SOURCE_DIR = 'src';
const TARGET_DIR = 'doc';
const TEMPLATE = resolve('scripts/md.jst');
const EXTENSIONS = new Set(['.js', '.jsx']);
const DOCCO_EXT = '.html';
const TARGET_EXT = '.md';

// <https://stackoverflow.com/a/45130990/870615>
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

async function genDoc(dir) {
  const files = await getFiles(dir);
  return Promise.all(files
    .filter(file => EXTENSIONS.has(extname(file)))
    .map(async (file) => { // e.g. `~/GitHub/y-comp/src/mixin/index.js`
      const ext = extname(file); // e.g. `.js`
      const name = basename(file, ext); // e.g. `index`
      const path = relative(resolve(), dirname(file)); // e.g. `src/mixin`
      const output = resolve(TARGET_DIR, path); // e.g. `~/GitHub/y-comp/doc/src/mixin`

      await docco({
        output,
        args: [file],
        template: TEMPLATE,
        css: 'none',
      });

      // docco generates .html files, but we want .md
      await rename(
        resolve(output, name + DOCCO_EXT), // e.g. `~/GitHub/y-comp/doc/src/mixin/index.html`
        resolve(output, name + TARGET_EXT), // e.g. `~/GitHub/y-comp/doc/src/mixin/index.md`
      );
    }));
}

genDoc(SOURCE_DIR)
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
