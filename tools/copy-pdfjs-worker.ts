import path, { dirname } from 'path';
import { copyFileSync, cpSync } from 'fs';

const pdfjsWorkerFile = path.dirname(import.meta.resolve('../node_modules/pdfjs-dist/package.json'));
const __dirname = dirname(import.meta.url)
cpSync('/Users/malex/projects/tickety-web/node_modules/pdfjs-dist/build/', '/Users/malex/projects/tickety-web/public/', {recursive: true});
