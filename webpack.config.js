const { readFileSync } = require('fs');
const { resolve } = require('path');

const {
  BannerPlugin,
  EnvironmentPlugin,
  optimize: {
    UglifyJsPlugin,
    ModuleConcatenationPlugin,
  },
} = require('webpack');

const merge = require('webpack-merge');
const { argv: { env } } = require('yargs');
const camelcase = require('camelcase');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { name: filename } = require('./package.json');

const min = env === 'lite' ? '-lite.min' : env === 'prod' ? '.min' : ''; // eslint-disable-line
const library = camelcase(filename);
const banner = readFileSync(resolve('./header.md'), 'utf-8');

const flatten = [(a, x) => a.concat(x), []];

function envConfig() {
  switch (env) {
    case 'prod':
      return {
        plugins: [
          new BannerPlugin({ banner }),
          new EnvironmentPlugin({ DEBUG: false }),
          new UglifyJsPlugin(),
        ],
      };

    // same as prod, but does not bundle core-js polyfills
    case 'lite':
      return {
        externals: [/^core-js/],
        plugins: [
          new BannerPlugin({ banner }),
          new EnvironmentPlugin({ DEBUG: false }),
          new UglifyJsPlugin(),
        ],
      };

    default:
      return {
        devtool: 'source-map',
        plugins: [
          new EnvironmentPlugin({ DEBUG: true }),
        ],
      };
  }
}

const baseConfig = merge({
  output: {
    filename: `${filename}${min}.js`,
    library,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
      },
      {
        test: /\.ejs$/,
        loader: 'underscore-template-loader',
      },
    ],
  },
  resolve: {
    modules: [
      resolve('./src'),
      resolve('./node_modules'),
      process.env.NODE_PATH ? resolve(process.env.NODE_PATH) : [],
    ].reduce(...flatten),
    extensions: ['.json', '.js'],
    symlinks: true,
  },
  plugins: [
    new ModuleConcatenationPlugin(),
  ],
}, envConfig());

const cssFileLoaderConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },
};

const cssRawLoaderConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'raw-loader',
      },
    ],
  },
};

const config = [
  // Mixin
  merge(baseConfig, {
    entry: resolve('./src/mixin/index.js'),
    output: {
      path: resolve('./dist/mixin'),
    },
  }),

  // Vanilla JS
  merge(baseConfig, cssFileLoaderConfig, {
    entry: resolve('./src/vanilla/index.js'),
    output: {
      path: resolve('./dist/vanilla'),
    },
  }),

  // jQuery
  merge(baseConfig, cssFileLoaderConfig, {
    entry: resolve('./src/jquery/index.js'),
    output: {
      path: resolve('./dist/jquery'),
    },
    externals: [{
      jquery: 'jQuery',
    }],
  }),

  // // React
  // merge(baseConfig, cssFileLoaderConfig, {
  //   entry: resolve('./src/react/index.jsx'),
  //   output: {
  //     path: resolve('./dist/react'),
  //   },
  //   externals: {
  //     react: 'React',
  //   },
  // }),

  // WebComponent Standalone
  merge(baseConfig, cssRawLoaderConfig, {
    entry: resolve('./src/webcomponent/index.js'),
    output: {
      path: resolve('./dist/webcomponent'),
    },
  }),

  // WebComponent Module
  merge(baseConfig, cssRawLoaderConfig, {
    entry: resolve('./src/webcomponent/module.js'),
    output: {
      path: resolve('./dist/webcomponent'),
      filename: `${filename}-module${min}.js`,
    },
  }),

  // WebComponent HTML Import
  merge(baseConfig, cssRawLoaderConfig, {
    entry: resolve('./src/webcomponent/html-import.js'),
    output: {
      path: resolve('./dist/webcomponent'),
      filename: `${filename}-html-import${min}.js`,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve('./src/webcomponent/index.ejs'),
        filename: `${filename}${min}.html`,
      }),
    ],
  }),
];

module.exports = config;
