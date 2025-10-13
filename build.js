const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

function webpackConfig(moduleName, basePath) {
  let tsx = true;
  try {
    fs.statSync(path.join(basePath, 'src', 'index.tsx'));
  } catch (err) {
    tsx = false;
  }
  const externals = [
    'bluebird', 'electron', 'exe-version', 'ffi', 'fs', 'fs-extra',
    'fs-extra-promise', 'immutability-helper', 'lodash', 'minimatch',
    'modmeta-db', 'nbind', 'net', 'node', 'node-7z', 'path', 'react',
    'react-bootstrap', 'react-dnd', 'react-dnd-html5-backend', 'react-dom',
    'react-i18next', 'react-layout-pane', 'react-redux', 'react-select',
    'redux-act', 'ref', 'request', 'semver', 'semvish', 'turbowalk',
    'util', 'vortex-api', 'vortex-parse-ini', 'vortexmt', 'winapi-bindings',
    'winston',
  ].reduce((prev, key) => { prev[key] = key; return prev; }, {});
  const alias = {
    'original-fs': path.join(__dirname, '..', '_stubs', 'original-fs'),
    'vortex-api': path.join(__dirname, '..', '_stubs', 'vortex-api'),
  };
  return {
    entry: path.join(basePath, 'src', tsx ? 'index.tsx' : 'index.ts'),
    target: 'electron-renderer',
    node: {__filename: false, __dirname: false},
    output: {
      libraryTarget: 'commonjs2',
      filename: 'index.js',
      sourceMapFilename: `${moduleName}.js.map`,
      path: path.resolve(basePath, 'dist'),
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/, options: { transpileOnly: true } }]
    },
    plugins: [],
    resolve: {extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'], alias},
    devtool: 'source-map',
    externals,
    mode: process.env.TARGET_ENV || 'development',
    stats: { errorDetails: true },
  };
}

const config = webpackConfig('fnis-integration', __dirname);

webpack(config, (err, stats) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(
    stats.toString({ colors: true, modules: false, children: false })
  );
});