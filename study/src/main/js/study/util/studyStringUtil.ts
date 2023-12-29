/**
 * 正規化を行う
 *
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
 *
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
 *
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
 *
 * @param str
 * @returns 判定結果
 */
export function simpleTrim(str: string) {
  return str?.trim();
}

/**
 * 文字列の中の正規表現などをエスケープする
 *
 * @param {string} string - エスケープ対象
 * @return エスケープ後の文字列
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $&はマッチした部分文字列全体を意味します
}

/**
 * 区切り文字で結合
 *
 * @param base ベース
 * @param add 追加す対象
 * @param separator 区切り文字1文字
 * @return 結合したもの
 */
export function joinBase(base: string, add: string, separator: string): string {
  const len = separator.length;
  // 先頭
  const addHead = add ? add.slice(0, len) : '';

  if (!addHead) return base;

  // 末尾
  const baseFoot = base ? base.slice(-len) : '';

  if (!baseFoot) return add;

  if (baseFoot === separator) {
    return addHead === separator ? base.slice(0, -len) + add : base + add;
  } else {
    return addHead === separator ? base + add : base + separator + add;
  }
}

/**
 * 区切り文字で結合
 *
 * @param base ベース
 * @param adds 追加する対象
 * @param separator 区切り文字1文字
 * @return 結合したもの
 */
export function joinBases(
  base: string,
  adds: string[],
  separator: string
): string {
  return adds.reduce((result, add) => joinBase(result, add, separator), base);
}

/**
 * keyを結合
 *
 * @param base ベース
 * @param adds 追加対象
 * @return 結合したパス
 */
export function keyJoin(base: string, ...adds: string[]): string {
  return joinBases(base, adds, '.');
}

/**
 * パスを結合
 *
 * @param base ベース
 * @param adds 追加対象
 * @return 結合したパス
 */
export function pathJoin(base: string, ...adds: string[]): string {
  return joinBases(base, adds, '/');
}
