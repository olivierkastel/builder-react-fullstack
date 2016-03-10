import fs from 'fs';
import ncp from 'ncp';
import mkdirp from 'mkdirp';

export function makeDir(name) {
  return new Promise((resolve, reject) => {
    mkdirp(name, err => err ? reject(err) : resolve());
  });
}

export function copyFile(src, dest) {
  return new Promise((resolve, reject) => {
    ncp(src, dest, err => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function readFile(src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, 'utf8', (readErr, data) => {
      if (readErr) reject(readErr);
      resolve(data);
    });
  });
}

export function writeFile(src, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(src, data, 'utf8', writeErr => {
      if (writeErr) reject(writeErr);
      resolve();
    });
  });
}
