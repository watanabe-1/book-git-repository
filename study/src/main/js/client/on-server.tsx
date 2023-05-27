import React from 'react';

/**
 * サーバー上で実行
 * @param {any} callback
 * @param {any} defaultValue
 * @param {string} valueIdentifier
 * @returns
 */
export function onServer(
  callback: (api: any, param?: any) => string,
  defaultValue,
  valueIdentifier: string
): [any, JSX.Element] {
  const anyWindow: any = window;
  if (anyWindow.isServer) {
    const jsonValue = callback(anyWindow.api, anyWindow.param);
    const sanitizedJson = jsonValue
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const scriptContent = `
            if(!window.serverData) { window.serverData = {} }
            window.serverData['${valueIdentifier}'] = JSON.parse("${sanitizedJson}".replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
            if(!window.ssrFlags) { window.ssrFlags = {} }
            window.ssrFlags['${valueIdentifier}'] = true
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
 * ssrflagの削除
 * @param valueIdentifier
 * @param isSSR
 */
export function deleteSSR(valueIdentifier: string) {
  const anyWindow: any = window;
  if (anyWindow.ssrFlags) {
    const isSSR = anyWindow.ssrFlags[valueIdentifier];
    if (typeof isSSR !== 'undefined') {
      // flagの削除
      anyWindow.ssrFlags[valueIdentifier] = undefined;
    }
  }
}

/**
 * ssrが行われていたか判定
 * @param valueIdentifier
 */
export function isSSR(valueIdentifier: string): boolean {
  const anyWindow: any = window;
  if (anyWindow.ssrFlags) {
    const isSSR = anyWindow.ssrFlags[valueIdentifier];
    console.log(`ssrFlag(${valueIdentifier}):${isSSR}`);
    if (isSSR) {
      // isSSRがtrueの時のみ
      return isSSR;
    }
  }
  // 取得できなかった時はfalseを返却
  return false;
}

/**
 * SSRがされてない場合は引数の関数を実行
 * SSRがされている場合は、SSRフラグをfalseに
 * @param valueIdentifiers
 * @param func SSRされていない時に実行するファンクション
 */
export function executeFuncIfNeeded(
  valueIdentifier: string,
  func: () => any = null
) {
  if (!isSSR(valueIdentifier)) {
    //ssrが行われなかった時
    if (func) {
      func();
    }
  } else {
    deleteSSR(valueIdentifier);
  }
}

/**
 * SSRがされてない場合は引数の関数を実行
 * SSRがされている場合は、SSRフラグをfalseに
 * @param targets SSRされていない時に実行するファンクション達
 */
export function executeFuncsIfNeeded(
  targets: { valueIdentifier: string; func: () => any }[]
) {
  targets.forEach((target) =>
    executeFuncIfNeeded(target.valueIdentifier, target.func)
  );
}
