import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

const anyWindow = window;

/**
 * 初期化
 * @param Root
 */
export const initialize = (Root: {
  (props: unknown): JSX.Element;
  (props: unknown): JSX.Element;
}) => {
  const StudyRoot = () => (
    <React.StrictMode>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </React.StrictMode>
  );

  /**
   * サーバーで実行された結果(html)と実行予測結果を比較(domを比較)し差分がなかったら
   * jsのイベントリスナーのみ付与する
   */
  anyWindow.hydrateApp = () => {
    ReactDOM.hydrateRoot(document.getElementById('root'), <StudyRoot />);
  };

  /**
   * 画面の再描画
   */
  anyWindow.renderApp = () => {
    ReactDOM.createRoot(document.getElementById('root')).render(<StudyRoot />);
  };

  /**
   * サーバーで実行
   * htmlを文字列で返却
   * @param url サーバーで実行時にurlを渡す
   */
  anyWindow.renderAppOnServer = (url: string) => {
    return ReactDOMServer.renderToString(
      <StaticRouter location={url}>
        <Root />
      </StaticRouter>
    );
  };
};
