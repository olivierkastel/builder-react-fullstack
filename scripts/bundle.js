import webpack from 'webpack';
import webpackConfig from '../config/webpack/webpack.config';

/**
 * Creates application bundles from the source files.
 */
export default function bundle() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.log(stats.toString(webpackConfig[0].stats)); //eslint-disable-line
      return resolve();
    });
  });
}
