const path = require('path');

const { merge } = require('webpack-merge');

const common = require('./webpack.config.cjs');

/**
 * 本家の webpack.config.js に設定をマージ（オーバーライド）
 * @type {import('webpack').Configuration}
 */
module.exports = merge(common, {
  // ブラウザー開発者ツール用に JavaScript のソースマップを出力
  devtool: 'source-map',
  // 開発用サーバーを 9080 ポートで起動
  devServer: {
    static: {
      directory: path.join(__dirname, '/src/main/resources/view'), // eslint-disable-line
    },
    watchFiles: ['src/main/js/**/*', 'src/main/css/**/*'],
    port: 9080,
    onAfterSetupMiddleware: function (devServer) {
      devServer.app.use('/api', function (req, res) {
        res.type('application/json');
        // Note: directory traversal
        res.sendFile(
          // .html のパス（コンテントルート）を指定
          // webpack でビルドされる JS/CSS などは修正がウォッチされ、
          // ビルド結果がメモリー上に展開され contentBase と合成される
          path.join(__dirname, '/src/test/js/json', req.originalUrl + '.json')
        ); // eslint-disable-line
      });
    },
  },
  resolve: {
    // alias: {
    //   // webpack.config.js の設定を上書き
    //   // import Vue from 'vue'; で開発版を読ませることで Vue のデバッグが可能になる
    //   vue$: 'vue/dist/vue.js',
    // },
  },
  performance: {
    hints: false,
  },
});
