import { readFileSync } from "fs";

function PrintImage() {
  readFileSync('./sample.png', { encoding: 'hex' });
}
