import { join } from 'path';
import { spawn } from 'child_process';
import webpackConfig from '../config/webpack/webpack.config';

const { output } = webpackConfig.find(x => x.target === 'node');
const serverPath = join(output.path, output.filename);

let server;

/**
 * Launches Node.js/Express web server in a separate (forked) process.
 */
export default function runServer(cb) {
  if (server) {
    server.kill('SIGTERM');
  }

  server = spawn(
    'node',
    [serverPath],
    {
      env: Object.assign({ NODE_ENV: 'development' }, process.env),
      silent: false,
      stdio: 'inherit',
    }
  );

  if (cb) {
    cb();
  }
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});
