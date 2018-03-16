#!/usr/bin/env node

// This script takes all `.js` and `.jsx` source files from `src`,
// runs them through `docco` and puts the results in `doc/src`.

const { promisify } = require('util');

const docco = promisify(require('docco').document); // eslint-disable-line
const fs = require('fs');
const { basename, dirname, extname, relative, resolve } = require('path');

const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);

const SOURCE_DIR = 'src';
const TARGET_DIR = 'doc/source';
const TEMPLATE = resolve('.scripts/md.jst');
const EXTENSIONS = new Set(['.js', '.jsx']);
const DOCCO_EXT = '.html';
const TARGET_EXT = '.md';

// <https://stackoverflow.com/a/45130990/870615>
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }),
  );
  return files.reduce((a, f) => a.concat(f), []);
}

async function genDoc(dir) {
  const files = process.argv.length > 2 ? [process.argv[2]] : await getFiles(dir);
  return Promise.all(
    files.filter(file => EXTENSIONS.has(extname(file))).map(async file => {
      // e.g. `~/GitHub/hy-comp/src/mixin/index.js`
      const ext = extname(file); // e.g. `.js`
      const bname = basename(file, ext); // e.g. `index`
      const name = bname === 'index' ? 'README' : bname; // e.g. `index` => `README`
      const path = relative(resolve(SOURCE_DIR), dirname(file)); // e.g. `mixin`
      const output = resolve(TARGET_DIR, path); // e.g. `~/GitHub/hy-comp/doc/source/mixin`

      await docco({
        args: [file],
        output,
        css: 'none',
        template: TEMPLATE,
      });

      // docco generates .html files, but we want .md
      await rename(
        resolve(output, bname + DOCCO_EXT), // e.g. `~/GitHub/hy-comp/doc/src/mixin/index.html`
        resolve(output, name + TARGET_EXT), // e.g. `~/GitHub/hy-comp/doc/src/mixin/README.md`
      );
    }),
  );
}

genDoc(SOURCE_DIR)
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
