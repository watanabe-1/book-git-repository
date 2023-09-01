import React from 'react';

import { OnServerApi } from '../@types/studyApi';

/**
 * サーバー上で実行
 * @param  callback
 * @param  defaultValue
 * @param  valueIdentifier
 * @returnsz
 */
export function onServer(
  callback: (api: OnServerApi) => string,
  defaultValue,
  valueIdentifier: string
): [unknown, JSX.Element] {
  const anyWindow = window;
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
    if (value) {
      console.log(`ssr:${valueIdentifier} value↓`);
      console.log(value);

      return [value, undefined];
    }
  }

  return [defaultValue, undefined];
}
