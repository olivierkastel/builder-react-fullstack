/**
 * This task builds and launches the node.js server.
 * This node.js server serves the application.
 * Even if the server rendering is disabled, the server serves the
 * static website.
 * Then it launches browser-sync to proxy requests to the node.js server.
 * Browser-sync allows live reloading ONLY if a public ressource has changed.
 * For all other changes (like react components, component css, etc...),
 * the webpackHotMiddleware reload the changing part of the app.
 */
import webpack from 'webpack';
import webpackMiddleware from 'webpack-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import BrowserSync from 'browser-sync';
import webpackConfig from '../config/webpack/webpack.config';

import runner from './runner';
import runServer from './runServer';
import copy from './copy';
import clean from './clean';

export default async function start() {
  await runner(clean);
  await runner(copy);

  await new Promise(resolve => {
    const bundler = webpack(webpackConfig);

    const wpMiddleware = webpackMiddleware(bundler, {
      publicPath: webpackConfig[0].output.publicPath,
      stats: webpackConfig[0].stats,
    });
    const hotMiddlewares = bundler.compilers
      .filter(compiler => compiler.options.target !== 'node')
      .map(compiler => webpackHotMiddleware(compiler));

    let doneOnce = false;
    const handleServerBundleComplete = () => {
      if (doneOnce) {
        runServer();
      } else {
        runServer(err => {
          if (!err) {
            const bs = BrowserSync.create();

            const proxyOptions = {
              target: 'localhost:5000',

              middleware: [wpMiddleware, ...hotMiddlewares],
            };

            bs.init({
              proxy: proxyOptions,
              files: [
                'build/public/**/*.css',
                'build/public/**/*.html',
              ],
            }, resolve);
            doneOnce = true;
          }
        });
      }
    };

    bundler.plugin('done', () => handleServerBundleComplete());
  });
}
