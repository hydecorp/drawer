const { resolve: r } = require('path');

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
const banner = String.prototype.trim.call(`
Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
`);

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
        externals: [/core-js/],
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
        // NOTE: exclude defined in .babelrc
        // exclude: {
        //   test: /node_modules/,
        //   exclude: /(y-component|camelcase)/,
        // },
      },
      {
        test: /\.ejs/,
        loader: 'underscore-template-loader',
      },
    ],
  },
  resolve: {
    modules: [r('./src'), r('./node_modules'), r(process.env.NODE_PATH)], // TODO: save?
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
        test: /\.css/,
        loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },
};

const cssRawLoaderConfig = {
  module: {
    rules: [
      {
        test: /\.css/,
        loader: 'raw-loader',
      },
    ],
  },
};

const config = [
  // Mixin
  merge(baseConfig, {
    entry: r('./src/mixin/index.js'),
    output: {
      path: r('./dist/mixin'),
    },
  }),

  // Vanilla JS
  merge(baseConfig, cssFileLoaderConfig, {
    entry: r('./src/vanilla/index.js'),
    output: {
      path: r('./dist/vanilla'),
    },
  }),

  // jQuery
  merge(baseConfig, cssFileLoaderConfig, {
    entry: r('./src/jquery/index.js'),
    output: {
      path: r('./dist/jquery'),
    },
    externals: [{
      jquery: 'jQuery',
    }],
  }),

  // // React
  // merge(baseConfig, cssFileLoaderConfig, {
  //   entry: r('./src/react/index.jsx'),
  //   output: {
  //     path: r('./dist/react'),
  //   },
  //   externals: {
  //     react: 'React',
  //   },
  // }),

  // WebComponent Standalone
  merge(baseConfig, cssRawLoaderConfig, {
    entry: r('./src/webcomponent/index.js'),
    output: {
      path: r('./dist/webcomponent'),
    },
  }),

  // WebComponent HTML Import
  merge(baseConfig, cssRawLoaderConfig, {
    entry: r('./src/webcomponent/html-import.js'),
    output: {
      path: r('./dist/webcomponent'),
      filename: `${filename}-html-import${min}.js`,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: r('./src/webcomponent/index.ejs'),
        filename: `${filename}${min}.html`,
      }),
    ],
  }),
];

module.exports = config;
