import { pathJoin } from './studyStringUtil';
import { objToFormData } from './studyYupUtil';
import { NestedObject, Type } from '../../@types/studyUtilType';
import { FetchError } from '../../error/studyError';

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
 * urlのコンテキストパスを取得
 *
 * @return urlのコンテキストパス
 */
export function getContextPath(): string {
  return (
    window.contextPath ||
    document.querySelector<HTMLMetaElement>('meta[name="contextPath"]').content
  );
}

/**
 * 画像がない場合の画像パスを取得
 *
 * @return 画像がない場合の画像パス
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
 * 認証期限切れか判定する
 *
 * @param res レスポンス
 * @returns
 */
export function isAuthExpired(res: Response) {
  return res?.status === 401;
}

/**
 * バリデーションエラーかを判定する
 *
 * @param res レスポンス
 * @returns
 */
function isValidationError(response) {
  return response.status === 400 || response.status === 422;
}

/**
 * 認証期限切れエラーか判定する
 *
 * @param err エラー
 * @returns
 */
export function isErrorAuthExpired(err: FetchError) {
  return isAuthExpired(err.response);
}

/**
 * get通信を行う
 *
 * @param baseurl 通信先
 * @param params パラメータ
 * @returns 通信結果
 */
export async function fetchGet(
  baseurl: string,
  params: Record<string, string> = {}
) {
  console.log(
    `call get:${baseurl}${!isObjEmpty(params) ? JSON.stringify(params) : ''}`
  );

  const query = new URLSearchParams(params);
  const url = pathJoin(getContextPath(), baseurl);

  const res: Response = await window.fetch(
    isObjEmpty(params) ? url : `${url}?${query}`
  );

  console.log('call get response:');
  console.log(res);

  if (!res.ok) {
    if (isAuthExpired(res)) {
      // 認証エラーの場合、カスタムエラーをスローする
      throw new FetchError(
        'Unauthorized: Access is denied due to invalid credentials.',
        res
      );
    } else {
      // その他の一般的なHTTPエラー
      throw new FetchError(
        `An error occurred: ${res.status} ${res.statusText}`,
        res
      );
    }
  }

  return res;
}

/**
 * post通信を行う
 *
 * @param baseurl 通信先
 * @param params 送付パラム
 * @returns 通信結果
 */
export async function fetchPost(
  baseurl: string,
  params: NestedObject = {}
): Promise<Response> {
  const headers = () => {
    const headers = {};
    //headers['Content-Type'] = 'application/json';
    headers[getCsrfTokenHeader()] = getCsrfToken();

    return headers;
  };

  console.log(`call post url: ${baseurl}`);
  // console.log(`call post param:${JSON.stringify(params)}`);
  const body = objToFormData(params);
  console.log('call post param:');
  console.log(...body.entries());

  const res: Response = await window.fetch(
    pathJoin(getContextPath(), baseurl),
    {
      method: 'POST',
      headers: headers(),
      body: body,
    }
  );
  // console.log(`call post response:${{ ...res }}`);

  console.log('call post response:');
  console.log(res);

  if (!res.ok) {
    if (isAuthExpired(res)) {
      // 認証エラーの場合、カスタムエラーをスローする
      throw new FetchError(
        `Unauthorized: Access is denied due to invalid credentials ${res.status} ${res.statusText}`,
        res
      );
    } else if (isValidationError(res)) {
      // formのバリデーションエラーはスローしない
      console.log(`Validation error occurred ${res.status} ${res.statusText}`);
    } else {
      // その他の一般的なHTTPエラー
      throw new FetchError(
        `An error occurred: ${res.status} ${res.statusText}`,
        res
      );
    }
  }
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
 * 数値か判定
 * @param value 判定対象
 * @returns
 */
export function isNumber(value: string) {
  return !isNaN(Number(value));
}
