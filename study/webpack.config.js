const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'production',
  entry: () => {
    const entries = {};
    //webapiをサーバーで使用する時用
    entries['webapi'] = ['./src/main/js/client/webapi'];
    // 全画面共通
    entries['vendor'] = [
      'axios',
      'popper.js',
      'chart.js',
      'flatpickr',
      'bootstrap',
      './src/main/js/view/common/sidebar',
    ];
    // 各画面
    glob.sync('./src/main/js/view/**/*.ts').forEach((file) => {
      const name = file.replace('./src/main/js/view/', '').replace('.ts', '');
      entries[name] = path.resolve(file);
    });
    // react
    glob.sync('./src/main/js/client/pages/**/*.tsx').forEach((file) => {
      const name = file.replace('./src/main/js/client', '').replace('.tsx', '');
      entries[name] = path.resolve(file);
    });
    return entries;
  },
  output: {
    // JavaScript は js/ 配下に配置
    filename: 'js/[name].bundle.js',
    // ビルドの出力先を /src/main/resources/static にする
    path: path.join(__dirname, '/src/main/resources/static'), // eslint-disable-line
    // Spring Boot のコンテキストパス（/study/）を設定する
    publicPath: '/study/',
    assetModuleFilename: 'res/[name].[hash][ext]',
  },
  // 参照元をすべて一つのファイルにまとめる
  optimization: {
    splitChunks: {
      cacheGroups: {
        //  共通で使用するベンダーモジュール(リアクト以外) outputに定義した[name = depens].bundle.jsに出力
        vender: {
          // test: /[\\/]node_modules[\\/](axios|popper.js|chart.js|flatpickr|bootstrap)[\\/]/,
          name: 'depens',
          chunks: 'initial',
        },
        // 共通で使用する自作モジュール outputに定義した[name = depens].bundle.jsに出力（venderとマージ）
        // study: {
        //   test: /[\\/]src[\\/]main[\\/]js[\\/](study)[\\/]/,
        //   name: 'depens',
        //   chunks: 'initial',
        // },
        // css: {
        //   test: /\.(sa|c)ss$/,
        //   name: 'depens',
        //   chunks: 'initial',
        // },
        // serverで実行するときにエラーになってしまうためリアクト系は共通出力しない
        // react: {
        //   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        //   name: 'react',
        //   chunks: 'initial',
        // },
      },
    },
  },
  plugins: [
    // .vue をビルド・バンドルするプラグイン
    //new VueLoaderPlugin(),
    // .css は JavaScript にバンドルせずにファイル出力するプラグイン
    //  css/ 配下に出力
    new MiniCssExtractPlugin({
      filename: 'css/[name].bundle.css',
    }),
  ],
  module: {
    rules: [
      {
        // 拡張子が.tsで終わるファイルに対して、TypeScriptコンパイラを適用する
        test: /\.ts|tsx$/,
        loader: 'ts-loader',
      },
      {
        // .js は babel を通してブラウザーで動作する JavaScript に変換
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
      // {
      //   // .vue の Vue.js コンポーネントをビルドしてバンドル
      //   test: /\.vue$/,
      //   loader: 'vue-loader',
      // },
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
    // '.js', '.jsx', '.ts', '.tsx'拡張子は import で付いてなくても解決
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // import するモジュールでパス付きでないものは npm の node_modules に入ってる
    modules: ['node_modules'],
    // alias: {
    //   // import Vue from 'vue'; は Product 用の ES Modules 版を使う
    //   vue$: 'vue/dist/vue.esm.js',
    // },
  },
  // target: ['web', 'es5'],
  performance: {
    maxAssetSize: 3000000,
    maxEntrypointSize: 3000000,
  },
};
