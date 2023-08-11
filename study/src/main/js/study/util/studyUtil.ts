import { objToFormData } from './studyYupUtil';
import { Type } from '../../@types/studyUtilType';

/**
 * 文字列の中の正規表現などをエスケープする
 *
 * @param {string} string - エスケープ対象
 * @return エスケープ後の文字列
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^=!:${}()|[\]/\\]/g, '\\$&'); // $&はマッチした部分文字列全体を意味します
}

/**
 * urlのプロトコルからホストまでを取得
 *
 * @return urlのプロトコルからホストまで
 */
export function getBaseUrl(): string {
  return location.protocol + '//' + location.host;
}

/**
 * コンテキストパスを付与
 *
 * @return コンテキストパスを結合したパス
 */
export function addContextPath(url: string): string {
  return pathJoin(getContextPath(), url);
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
  // 末尾
  const baseFoot = base ? base.slice(-len) : '';

  if (!addHead) return baseFoot;

  if (!baseFoot) return addHead;

  if (baseFoot === separator) {
    return addHead === separator ? base.slice(0, -len) + add : base + add;
  } else {
    return addHead === separator ? base + add : base + separator + add;
  }
}

/**
 * urlのコンテキストパスを取得
 *
 * @return urlのコンテキストパス
 */
export function getContextPath(): string {
  const anyWindow = window;

  return anyWindow.contextPath
    ? anyWindow.contextPath
    : document.querySelector<HTMLMetaElement>('meta[name="contextPath"]')
        .content;
}

/**
 * urlのパラメーターを取得
 *
 * @param {string} paramName - パラメーター名
 * @return urlのパラメータ
 */
export function getLocationHrefParm(paramName: string): string {
  // URLを取得
  const url: URL = new URL(window.location.href);
  // URLSearchParamsオブジェクトを取得
  const params: URLSearchParams = url.searchParams;
  // getメソッド
  const param: string = params.get(paramName);

  return param;
}

/**
 * 画像がない場合の画像パスを取得
 *
 * @return urlのコンテキストパス
 */
export function getNoImagePath(): string {
  return pathJoin(getContextPath(), '/images/no_image.png');
}

/**
 * CSRF対策用のトークンを取得
 *
 * @return CSRF対策用のトークン
 */
export function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="_csrf"]').content;
}

/**
 * CSRF対策用のトークン送信用ヘッダー名を取得
 *
 * @return CSRF対策用のトークン送信用ヘッダー名CSRF対策用のトークン
 */
export function getCsrfTokenHeader(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="_csrf_header"]')
    .content;
}

/**
 * CSRF対策用のトークン送信用パラム名を取得
 *
 * @return CSRF対策用のトークン送信用ヘッダー名CSRF対策用のトークン
 */
export function getCsrfTokenParmName(): string {
  return document.querySelector<HTMLMetaElement>(
    'meta[name="_csrf_parameterName"]'
  ).content;
}

/**
 * 対象要素のクラスを入れかえ
 * クラス1があった場合は、クラス2に
 * クラス2があった場合は、クラス1に
 * 両クラスともになかった場合は、クラス2を追加
 * 両クラスともあった場合は、クラス1を削除
 *
 * @param {HTMLElement} target クラス切り替え対象
 * @param {string} classOne 切り替えクラス1
 * @param {string} classTwo 切り替えクラス2
 */
export function swichClass(
  target: HTMLElement,
  classOne: string,
  classTwo: string
): void {
  if (
    target.classList.contains(classOne) &&
    target.classList.contains(classTwo)
  ) {
    //どちらも含まれている
    target.classList.toggle(classOne);
  } else if (
    !target.classList.contains(classOne) &&
    !target.classList.contains(classTwo)
  ) {
    //どちらも含まれていない
    target.classList.toggle(classTwo);
  } else {
    //片方は含まれている
    target.classList.toggle(classOne);
    target.classList.toggle(classTwo);
  }
}

/**
 * オブジェクトが空か判定する
 * @param obj
 * @returns 判定結果
 */
export function isObjEmpty(obj: object) {
  for (const i in obj) {
    return false;
  }

  return true;
}

/**
 * get通信を行う
 * @param baseurl 通信先
 * @param params パラメータ
 * @returns 通信結果
 */
export async function fetchGet(
  baseurl: string,
  params: Record<string, string> = {}
) {
  const query = new URLSearchParams(params);
  const url = pathJoin(getContextPath(), baseurl);
  const res: Response = await window.fetch(
    isObjEmpty(params) ? url : url + '?' + query
  );
  if (!res.ok) {
    throw new Error(`unexpected status: ${res.status}`);
  }

  return res;
}

/**
 * post通信を行う
 * @param baseurl 通信先
 * @param params 送付パラム
 * @returns 通信結果
 */
export async function fetchPost(
  baseurl: string,
  params = {}
): Promise<Response> {
  const headers = () => {
    const headers = {};
    //headers['Content-Type'] = 'application/json';
    headers[getCsrfTokenHeader()] = getCsrfToken();

    return headers;
  };

  const body = objToFormData(params);
  //console.log(...body.entries());
  //console.log(JSON.stringify(params));

  const res: Response = await window.fetch(
    pathJoin(getContextPath(), baseurl),
    {
      method: 'POST',
      headers: headers(),
      body: body,
    }
  );
  console.log(res);
  // if (!res.ok) {
  //   throw new Error(`unexpected status: ${res.status}`);
  // }
  // const json = await res.json();
  // console.log(json);

  return res;
}

/**
 * String型をtype型に変換
 * @param str  対象
 * @returns type
 */
export function stringToType(str: string) {
  return {
    code: str,
    name: str,
  } as Type;
}

/**
 * String型をtype型に変換
 * @param str  対象
 * @returns type
 */
export function ToTypeArrayIfIsStringArray(array: Type[] | string[]) {
  return array.map((str) =>
    typeof str === 'string' ? stringToType(str) : (str as Type)
  );
}

/**
 * null もしくは emptyの時valueで置き換え
 * @param target  対象
 * @param value  置き換える値
 * @returns type
 */
export function nullOrEmptyValueLogic(target: unknown, value: unknown) {
  return target ? target : value;
}

/**
 * 数値か判定
 * @param value 判定対象
 * @returns
 */
export function isNumber(value: string) {
  return isNaN(Number(value));
}
