const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'production',
  entry: {
    // 共通系の JavaScript ライブラリーは vendor.bundle.js としてひとつにまとめる
    // .css は bootstrap の .css と合成するため vendor に含めておく
    vendor: [
      'vue',
      'axios',
      'popper.js',
      'chart.js',
      'flatpickr',
      'bootstrap',
      './src/main/js/view/common/sidebar.js',
    ],
    // 画面ごとの .js は分割して出力する（この設定のファイルを起点にバンドル開始）
    booksIndex: './src/main/js/view/books/booksIndex.js',
    chartColourIndex: './src/main/js/view/chartColour/chartColourIndex.js',
    accountIndex: './src/main/js/view/account/accountIndex.js',
    categoryIndex: './src/main/js/view/category/categoryIndex.js',
  },
  output: {
    // JavaScript は js/ 配下に配置
    filename: 'js/[name].bundle.js',
    // ビルドの出力先を /study/WebContent にする
    path: path.join(__dirname, '/WebContent'), // eslint-disable-line
    // Spring Boot のコンテキストパス（/study/）を設定する
    publicPath: '/study/',
    assetModuleFilename: 'res/[name].[hash][ext]',
  },
  optimization: {
    // 共通 JavaScript/CSS を vendor という名前で出力する
    splitChunks: {
      cacheGroups: {
        vender: {
          name: 'depens',
          chunks: 'initial',
        },
      },
    },
  },
  plugins: [
    // .vue をビルド・バンドルするプラグイン
    new VueLoaderPlugin(),
    // .css は JavaScript にバンドルせずにファイル出力するプラグイン
    //  css/ 配下に出力
    new MiniCssExtractPlugin({
      filename: 'css/[name].bundle.css',
    }),
  ],
  module: {
    rules: [
      {
        // .js は babel を通してブラウザーで動作する JavaScript に変換
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
      {
        // .vue の Vue.js コンポーネントをビルドしてバンドル
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        // .css|.sass ファイルをビルドして css/ ディレクトリに出力
        test: /\.(sa|c)ss$/,
        use: [
          // 各ローダーは定義の下から順に適用される（Sass-> CSS -> Extract）
          // https://webpack.js.org/concepts/loaders/#configuration
          // 3rd loader
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // 2nd loader
          // .css 内の URL パスなどをそれぞれの publicPath に合わせてくれる
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          // 1st loader
          // .sass のビルド
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        // bootstrap などで使われるフォントファイルは asset/ ディレクトリーに
        // ファイル出力
        test: /\.(ttf|otf|eot||wofwofff2)$/,
        type: 'asset/resource',
      },
      {
        // 画像ファイルは asset/ ディレクトリーにファイル出力
        test: /\.(png|jpg|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    // .js と .vue 拡張子は import で付いてなくても解決
    extensions: ['.js', '.vue'],
    // import するモジュールでパス付きでないものは npm の node_modules に入ってる
    modules: ['node_modules'],
    alias: {
      // import Vue from 'vue'; は Product 用の ES Modules 版を使う
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  performance: {
    maxAssetSize: 3000000,
    maxEntrypointSize: 3000000,
  },
};
