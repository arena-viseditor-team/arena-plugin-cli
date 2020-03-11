const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const external = path.resolve(__dirname, './provide.js')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = function (config, root, prod) {
  const entry = {...config.extendedEntries}
  if (config.entry) {
    entry.plugin = config.entry
  }
  const babelPresets = [[require(path.resolve(root, 'node_modules', '@babel', 'preset-env')).default, {targets: '> 0.25%, not dead'}]];

  const cfg = {
    mode: 'production',
    devtool: false,
    entry,
    module: {
      rules: [
        {
          test: /\.js$/,
          // exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: babelPresets,
              plugins: [
                path.resolve(
                  root,
                  'node_modules',
                  'babel-plugin-transform-class-properties',
                ),
              ],
            },
          },
        },
        {
          test: /\.arena\.jsx$/,
          // exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: babelPresets,
              plugins: [
                [path.resolve(root, 'node_modules', '@babel/plugin-transform-react-jsx'), {
                  'pragma': 'ArenaPluginTrans', // default pragma is React.createElement
                  'pragmaFrag': 'ArenaPluginTrans.f', // default is React.Fragment
                  'throwIfNamespace': false, // defaults to true
                }],
              ],
            },
          },
        },
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                quality: 85,
                limit: Number.MAX_SAFE_INTEGER,
              },
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-prefix-selector')({prefix: `[arena-scope="${config.id}"][arena-scope-version="${config.version}"]`}),
                ],
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    output: {
      filename: `[name]-${config.id}.compiled`,
      path: config.dist,
      library: `${config.id}-${config.version}`,
      libraryTarget: 'window',
    },
    resolveLoader: {
      modules: [path.resolve(root, 'node_modules')],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    plugins: [
      // new webpack.NormalModuleReplacementPlugin(/arena-types/, './types.js'),
      // new webpack.IgnorePlugin('arena-types'),
      new webpack.ProvidePlugin({
        document: [external, 'document'],
        Vue: [external, 'Vue'],
        // 'arena-types': [external, 'types'],
      }),
      new MiniCssExtractPlugin({
        filename: '[name]_style.css',
      }),
    ],
  }

  if (prod) {
    cfg.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
    }
  }

  return cfg
}
