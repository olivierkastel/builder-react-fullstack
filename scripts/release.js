import semver from 'semver';
import { readFile, writeFile } from './lib/fs';
import { execCmd } from './lib/cp';

const ROOT = process.cwd();

const npmPackageFile = 'package.json';
const dockerComposeFile = 'docker-compose.yml';

export default async function release() {
  const npmPackage = require(`${ROOT}/package.json`);

  let nextVersion;
  if (semver.valid(process.argv[3])) {
    nextVersion = process.argv[3];
  } else {
    nextVersion = semver.inc(npmPackage.version, process.argv[3], process.argv[4]);
  }

  if (!process.argv[2]) {
    console.log('Missing version. Aborting.'); // eslint-disable-line
    process.exit(-1);
  }

  /* eslint-disable */
  console.log(`
    Creating a new version.
    Current version: ${npmPackage.version}
    Next version: ${nextVersion}
  `);
  /* eslint-enable */

  console.log('Starting new Gitflow release'); // eslint-disable-line
  await execCmd(`git flow release start ${nextVersion}`);
  console.log('Gitflow release created'); // eslint-disable-line

  console.log('ShrinkWrap package'); // eslint-disable-line
  await execCmd('npm shrinkwrap'); // eslint-disable-line
  console.log('ShrinkWrap done'); // eslint-disable-line

  console.log('Bumping package.json'); // eslint-disable-line

  const packageData = await readFile(npmPackageFile);
  const newPackageData = packageData.replace(/.version.*$/m, `"version": "${nextVersion}",`);

  await writeFile(npmPackageFile, newPackageData);
  console.log('package.json bumped'); // eslint-disable-line

  console.log('Bumping docker-compose.yml'); // eslint-disable-line
  const composeData = await readFile(dockerComposeFile);
  const regexp = new RegExp(`:${npmPackage.version}$`, 'm');
  const newComposeData = composeData.replace(regexp, `:${nextVersion}`);

  await writeFile(dockerComposeFile, newComposeData);
  console.log('docker-compose.yml bumped'); // eslint-disable-line
}
