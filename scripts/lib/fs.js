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
