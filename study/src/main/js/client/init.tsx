import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

const anyWindow: any = window;

/**
 * 初期化
 * @param Root
 */
export const initialize = (Root: { (): JSX.Element; (): JSX.Element }) => {
  /**
   * サーバーで実行された結果(html)と実行予測結果を比較(domを比較)し差分がなかったら
   * jsのイベントリスナーのみ付与する
   */
  anyWindow.hydrateApp = () => {
    ReactDOM.hydrate(<Root />, document.getElementById('root'));
  };
  /**
   * 画面の再描画
   */
  anyWindow.renderApp = () => {
    ReactDOM.render(<Root />, document.getElementById('root'));
  };
  /**
   * サーバーで実行
   * htmlを文字列で返却
   */
  anyWindow.renderAppOnServer = () => {
    return ReactDOMServer.renderToString(<Root />);
  };
};
