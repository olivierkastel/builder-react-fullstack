import runner from './runner';
import clean from './clean';
import copy from './copy';
import bundle from './bundle';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
export default async function build() {
  await runner(clean);
  await runner(copy);
  await runner(bundle);
}
