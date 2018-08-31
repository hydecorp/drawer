const { readFileSync } = require("fs");
const { resolve } = require("path");

const { BannerPlugin, EnvironmentPlugin } = require("webpack");

const merge = require("webpack-merge");
const {
  argv: { mode },
} = require("yargs");
const camelcase = require("camelcase");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const { name: filename } = require("./package.json");

const min = mode === "production" ? "" : ".dev";
const library = camelcase(filename);
const banner = readFileSync(resolve("./header.txt"), "utf-8");

const flatten = [(a, x) => a.concat(x), []];

function envConfig() {
  switch (mode) {
    case "production":
      return {
        plugins: [new EnvironmentPlugin({ DEBUG: false }), new BannerPlugin({ banner })],
      };

    default:
      return {
        plugins: [new EnvironmentPlugin({ DEBUG: true })],
      };
  }
}

const baseConfig = merge(
  {
    devtool: "source-map",
    output: {
      filename: `index${min}.js`,
      library,
      libraryTarget: "umd",
      umdNamedDefine: true,
    },
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { modules: false }]],
            babelrc: false,
          },
        },
        {
          test: /\.html$/,
          use: "raw-loader",
        },
        {
          test: /\.ejs$/,
          loader: "underscore-template-loader",
        },
      ],
    },
    resolve: {
      modules: [
        resolve("./src"),
        resolve("./node_modules"),
        process.env.NODE_PATH ? resolve(process.env.NODE_PATH) : [],
      ].reduce(...flatten),
      extensions: [".json", ".js"],
      symlinks: true,
    },
  },
  envConfig()
);

const cssRawLoaderConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "raw-loader",
      },
    ],
  },
};

const config = [
  // Mixin
  merge(baseConfig, {
    entry: resolve("./src/mixin/index.js"),
    output: {
      path: resolve("./dist/mixin"),
    },
  }),

  // Vanilla JS
  merge(baseConfig, {
    entry: resolve("./src/vanilla/index.js"),
    output: {
      path: resolve("./dist/vanilla"),
    },
  }),

  // jQuery
  merge(baseConfig, {
    entry: resolve("./src/jquery/index.js"),
    output: {
      path: resolve("./dist/jquery"),
    },
    externals: [
      {
        jquery: "jQuery",
      },
    ],
  }),

  // WebComponent Standalone
  merge(baseConfig, {
    entry: resolve("./src/webcomponent/index.js"),
    output: {
      path: resolve("./dist/webcomponent"),
    },
  }),

  // WebComponent Module
  merge(baseConfig, {
    entry: resolve("./src/webcomponent/module.js"),
    output: {
      path: resolve("./dist/webcomponent"),
      filename: `module${min}.js`,
    },
  }),

  // WebComponent HTML Import
  merge(baseConfig, cssRawLoaderConfig, {
    entry: resolve("./src/webcomponent/html-import.js"),
    output: {
      path: resolve("./dist/webcomponent"),
      filename: `html-import${min}.js`,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve("./src/webcomponent/index.ejs"),
        filename: `${filename}${min}.html`,
      }),
    ],
  }),
];

module.exports = config;
