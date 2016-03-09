import { copyFile } from './lib/fs';
import replace from 'replace';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
export default async function copy() {
  await copyFile('./package.json', './build/package.json');
  await copyFile('./src/images/favicon/favicon.ico', './build/public/favicon.ico');

  replace({
    regex: '"start".*',
    replacement: '"start": "node server.js"',
    paths: ['build/package.json'],
    recursive: false,
    silent: false,
  });
}
