import React from 'react';

/**
 * サーバー上で実行
 * @param {any} callback
 * @param {any} defaultValue
 * @param {string} valueIdentifier
 * @returns
 */
export function onServer(
  callback,
  defaultValue,
  valueIdentifier: string
): [any, JSX.Element] {
  const anyWindow: any = window;
  if (anyWindow.isServer) {
    const jsonValue = callback(anyWindow.api);
    const sanitizedJson = jsonValue
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const scriptContent = `
            if(!window.serverData) { window.serverData = {} }
            window.serverData['${valueIdentifier}'] = JSON.parse("${sanitizedJson}".replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
        `;
    const initScript = (
      <script
        className="serverData"
        dangerouslySetInnerHTML={{ __html: scriptContent }}
      ></script>
    );
    return [JSON.parse(jsonValue), initScript];
  }
  if (anyWindow.serverData) {
    const value = anyWindow.serverData[valueIdentifier];
    anyWindow.serverData[valueIdentifier] = undefined;
    if (value) {
      return [value, undefined];
    }
  }
  return [defaultValue, undefined];
}

/**
 * ssrが行われていたか判定
 */
export function isSSR() {
  const anyWindow: any = window;
  //console.log(anyWindow.isSSR);
  return anyWindow.isSSR;
}

/**
 * ssr判定フラグにセット
 * @param isSSR
 */
export function setSSR(isSSR) {
  const anyWindow: any = window;
  //console.log(anyWindow.isSSR);
  anyWindow.isSSR = isSSR;
}
/**
 * SSRがされてない場合は引数の関数を実行
 * SSRがされている場合は、SSRフラグをfalseに
 * @param func SSRされていない時に実行するファンクション
 */
export function executeFirst(func = null) {
  if (!isSSR()) {
    //ssrが行われなかった時
    if (func) {
      func();
    }
  } else {
    // SSRフラグをfalseに
    setSSR(false);
  }
}
