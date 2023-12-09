/**
 * 正規化を行う
 * @param str 正規化対象
 * @param form 正規化レベル 省略時 NFKC
 * @returns 正規化後
 */
export function normalizeString(
  str: string,
  form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' = 'NFKC'
): string {
  return str.normalize(form);
}

/**
 * ひらがなからカタカナに変換
 * @param str 変換対象
 * @returns
 */
export function hiraToKata(str: string) {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const charCode = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(charCode);
  });
}

/**
 * カタカナからひらがなに変換
 * @param str 変換対象
 * @returns
 */
export function kataToHira(str: string) {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const charCode = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(charCode);
  });
}
/**
 * オブジェクトをtrimする
 * @param str
 * @returns 判定結果
 */

export function simpleTrim(str: string) {
  return str?.trim();
}
