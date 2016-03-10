import del from 'del';
import { makeDir } from './helpers/fs';

/**
 * Cleans up the output (build) directory.
 */
export default async function clean() {
  await del(['.tmp', 'build/*'], { dot: true });
  await makeDir('build/public');
}
