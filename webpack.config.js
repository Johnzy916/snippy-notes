const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackElementPlugin = require('html-webpack-element-plugin');

module.exports = env => {
  const isDev = env.dev

  return  {
    entry: {
      app: './src/app.js',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: isDev ? '[name].bundle.js' : '[name].[hash].js',
      publicPath: '/',
    },
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //     name: false
    //   }
    // },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
        },
        {
          test: /\.(c|sc|sa)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isDev
              },
            },
            'css-loader',
            'sass-loader',
          ],
          sideEffects: true,
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images',
              },
            },
          ],
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(), //// clear out dist folder on build
      new MiniCssExtractPlugin({ //// extract css
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),
      new HtmlWebpackPlugin({ //// create index
        title: 'Snippy Notes',
        filename: 'index.html',
        meta: [
          {
            content: 'ie=edge',
            'http-equiv': 'x-ua-compatible',
          },
          {
            name: 'description',
            content: 'A simple notes app. Take notes, save, and expand snippets with ease.',
          },
        ],
      }),
      new FaviconsWebpackPlugin({ //// create and add favicons
        logo: './src/images/logo.png',
        prefix: 'assets/favicons',
        favicons: {
          start_url: '/notes',
          appName: 'snippy-notes',
          appDescription: 'A simple notes app with saved snippet expanders.',
          developerName: 'Jhonathan Angus',
          developerURL: null, //// prevent retrieving from package.json
          background: '#91BED4',
          theme_color: '#304269',
          icons: {
            android: true,
            appleIcon: true,
            appleStartup: false,
            firefox: true,
            windows: false,
            coast: false,
            yandex: false,
            favicons: true,
          }
        },
      }),
      new HtmlWebpackElementPlugin('app'), //// add 'app' div to index
      new Dotenv({ //// add firebase config
        path: './config/app-prod.env'   //////////////////// CHANGE FOR CUSTOM DB
      }),
    ],
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'inline-source-map' : 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      historyApiFallback: true,
    },
  }
}