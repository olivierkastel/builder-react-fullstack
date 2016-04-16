import { join, resolve } from 'path';
import { readdirSync } from 'fs';
import webpack from 'webpack';
import IsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import SplitByPathPlugin from 'webpack-split-by-path';
import makeIsomorphicConfig from './webpack.isomorphic.config';

const REGULAR_EXPRESSION = 'regular_expression';
const ROOT = process.cwd();

const DEBUG = !process.argv.includes('--release');
const ONBUILD_REDUX_DEVTOOLS = process.argv.includes('--devtools');
const ONBUILD_REACT_PERF = process.argv.includes('--react-perf');
const ONBUILD_SERVER_RENDERING = process.argv.includes('--isomorphic');
const VERBOSE = process.argv.includes('--verbose');
const WATCH = process.argv.includes('serve');

const GLOBALS = {
  __ONBUILD_SERVER_RENDERING__: ONBUILD_SERVER_RENDERING || DEBUG,
  __ONBUILD_REDUX_DEVTOOLS__: ONBUILD_REDUX_DEVTOOLS || DEBUG,
  __ONBUILD_REACT_PERF__: ONBUILD_REACT_PERF || DEBUG,
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEVELOPMENT__: DEBUG,
  __PRODUCTION__: !DEBUG,
};
const JS_LOADER = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  include: ROOT,
  loader: require.resolve('babel-loader'),
  query: {
    cacheDirectory: true,
  },
};

const context = join(resolve(ROOT), './src');

const isomorphicToolsPlugin = new IsomorphicToolsPlugin(
  makeIsomorphicConfig(context)
).development(DEBUG);

const nodeModules = readdirSync(join(resolve(ROOT), './node_modules'))
  .filter(x => !['.bin'].includes(x));

// Common config. Used both for client and server.
const commonConfig = {
  context,

  output: {
    publicPath: '/public/',
  },

  resolve: {
    root: context,
    fallback: join(ROOT, 'node_modules'),
  },

  cache: DEBUG,
  debug: VERBOSE,
  verbose: VERBOSE,
  displayErrorDetails: VERBOSE,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],

  module: {
    preLoaders: [
      DEBUG ? {
        test: /\.jsx?$/,
        loader: require.resolve('source-map-loader'),
      } : null,
    ].filter(x => !!x),
    loaders: [
      {
        test: /\.json$/,
        loader: require.resolve('json-loader'),
      }, {
        test: /\.txt$/,
        loader: require.resolve('raw-loader'),
      },
      {
        test: isomorphicToolsPlugin[REGULAR_EXPRESSION]('images'),
        loader: `${require.resolve('url-loader')}?limit=10240`,
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: require.resolve('file-loader'),
      },
    ],
  },
};

// Client specific config. We merge the new config with the common config.
const appConfig = Object.assign({}, commonConfig, {
  devtool: DEBUG ? '#cheap-module-eval-source-map' : false,

  entry: {
    client: [
      require.resolve('babel-polyfill'),
      ...(WATCH ? [require.resolve('webpack-hot-middleware/client')] : []),
      './clientEntry.js',
    ],
  },

  output: {
    ...commonConfig.output,
    path: join(ROOT, './build/public'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
  },

  resolve: {
    ...commonConfig.resolve,
  },

  plugins: [
    ...commonConfig.plugins,
    new webpack.DefinePlugin(GLOBALS),
    isomorphicToolsPlugin,
    new SplitByPathPlugin([
      {
        name: 'vendor',
        path: join(ROOT, 'node_modules'),
      },
    ]),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE,
        },
      }),
    ] : []),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ] : []),
  ],

  module: {
    ...commonConfig.module,
    loaders: [
      WATCH ? {
        ...JS_LOADER,
        query: {
          plugins: [
            ['react-transform', {
              transforms: [
                {
                  transform: require.resolve('react-transform-hmr'),
                  imports: ['react'],
                  locals: ['module'],
                },
              ],
            },
           ],
          ],
        },
      } : JS_LOADER,
      ...commonConfig.module.loaders,
    ],
  },
});

// Server specific config. We merge the new config with the common config.
const serverConfig = Object.assign({}, commonConfig, {
  devtool: 'source-map',

  entry: {
    server: [
      require.resolve('babel-polyfill'),
      './serverEntry.js',
    ],
  },

  output: {
    ...commonConfig.output,
    path: join(ROOT, './build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    ...commonConfig.resolve,
    packageMains: ['webpack', 'web', 'browserify', ['jam', 'main'], 'main', 'browser'],
  },

  target: 'node',

  externals: nodeModules,

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  plugins: [
    ...commonConfig.plugins,
    new webpack.DefinePlugin(GLOBALS),
    new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: false,
    }),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE,
        },
      }),
    ] : []),
  ],

  module: {
    ...commonConfig.module,
    loaders: [
      JS_LOADER,
      ...commonConfig.module.loaders,
    ],
  },
});

export default [appConfig, serverConfig];
