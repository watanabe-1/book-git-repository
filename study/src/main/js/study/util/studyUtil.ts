import { ErrorResults } from '../../@types/studyUtilType';

/**
 * aタグにセットされているhref属性にパラメーターをセットする共通関数
 *
 * @param {string} aTagQualifiedName - aタグ一意に指定できるquerySelectorのelement
 * @param {string} paramName - パラメーター名
 * @param {string} param - パラメーター値
 * @return セットしたurl
 */
export function setAtagHrefParm(
  aTagQualifiedName: string,
  paramName: string,
  param: string
): string {
  const target: Element = document.querySelector(aTagQualifiedName);
  const href: string = target.getAttribute('href');
  const baseUrl: string = getBaseUrl();
  const url: URL = new URL(href, baseUrl);
  url.searchParams.set(paramName, param);
  //別に置換しなくても絶対urlがaタグにセットされるだけだけど見た目的に一応置換して相対urlに
  const newHref: string = url.href.replace(baseUrl, '');

  //console.log(newHref);
  target.setAttribute('href', newHref);
  return newHref;

  /* 手動でパラメータ操作する場合
  let newHref = null;
  if (href.indexOf(paramName) > 0) {
    //「パラム + =」 から 「&」までの間を抜き出す用の正規表現
    let re = new RegExp(
      `${escapeRegExp(paramName + '=')}(.*)${escapeRegExp('&')}`
    );
    let newParam = paramName + '=' + param + '&';
    if (href.match(re) == null) {
      //「パラム + =」 から 以降を抜き出す用の正規表現
      re = new RegExp(`${escapeRegExp(paramName + '=')}(.*)`);
      newParam = paramName + '=' + param;
    }
    newHref = href.replace(re, newParam);
  } else {
    //パラメータに追加するだけ
    const paramHead =
      href.indexOf('?') > 0 ? '&' + paramName + '=' : '?' + paramName + '=';
    newHref = href + paramHead + param;
  }
  console.log(newHref);
  target.setAttribute('href', newHref);
  return newHref;
  */
}

/**
 * aタグにセットされているhref属性にパラメーターをセットする共通関数
 *
 * @param {string} aTagQualifiedName - aタグ一意に指定できるquerySelectorのelement
 * @param {Object} params - {パラメータ名: パラメーター値}
 * @return セットしたurl
 */
export function setAtagHrefParms(
  aTagQualifiedName: string,
  params: Object
): string {
  const target: Element = document.querySelector(aTagQualifiedName);
  const href: string = target.getAttribute('href');
  const baseUrl: string = getBaseUrl();
  const url: URL = new URL(href, baseUrl);
  //const json = JSON.parse(params);

  for (const key in params) {
    //console.log(key + ': ' + params[key]);
    url.searchParams.set(key, params[key]);
  }
  // params.keys(param).forEach(function (key) {
  //   console.log([key] + ': ' + param[key]);
  //   url.searchParams.set(key, param[key]);
  // });

  //別に置換しなくても絶対urlがaタグにセットされるだけだけど見た目的に一応置換して相対urlに
  const newHref: string = url.href.replace(baseUrl, '');

  target.setAttribute('href', newHref);
  return newHref;
}

/**
 * urlにパラメータを追加
 *
 * @param {string} targetUrl - url
 * @param {Object} params - {パラメータ名: パラメーター値}
 * @return セットしたurl
 */
export function addUrlParms(targetUrl: string, params: Object): string {
  const baseUrl: string = getBaseUrl();
  const url: URL = new URL(targetUrl, baseUrl);
  //const json = JSON.parse(params);

  for (const key in params) {
    //console.log(key + ': ' + params[key]);
    url.searchParams.set(key, params[key]);
  }
  // params.keys(param).forEach(function (key) {
  //   console.log([key] + ': ' + param[key]);
  //   url.searchParams.set(key, param[key]);
  // });

  //別に置換しなくても絶対urlがaタグにセットされるだけだけど見た目的に一応置換して相対urlに
  const newHref: string = url.href.replace(baseUrl, '');

  return newHref;
}

/**
 * 文字列の中の正規表現などをエスケープする
 *
 * @param {string} string - エスケープ対象
 * @return エスケープ後の文字列
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&'); // $&はマッチした部分文字列全体を意味します
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
 * @return コンテキストパスを結合したパス
 */
export function pathJoin(base: string, add: string): string {
  const SLASH = '/';
  // 先頭
  const addHead = add.slice(0, 1);
  // 末尾
  const baseFoot = base.slice(-1);

  if (baseFoot == SLASH) {
    return addHead == SLASH ? base.slice(0, -1) + add : base + add;
  } else {
    return addHead == SLASH ? base + add : base + SLASH + add;
  }
}

/**
 * urlのコンテキストパスを取得
 *
 * @return urlのコンテキストパス
 */
export function getContextPath(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="contextPath"]')
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

// /**
//  *ajaxで非同期通信を行い、帰ってきたJSONを引数に第三引数のメソッドを実行する
//  *
//  * @param {string} method -通信方法('GET' or 'POST')
//  * @param {string} url -送信先url
//  * @param {string} params -送信時にセットするパラメーター
//  * @param {function()} callBackFunction 引数に取得したjsonオブジェクトをとる関数を指定
//  * @param {any} callBackFunction に追加で渡す引数
//  */
// function ajax(method, url, params, callBackFunction, callBackFunctionArg) {
//   let httpRequest = new XMLHttpRequest(); // XMLHttpRequestのインスタンス作成
//   httpRequest.open(method, url, true); // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
//   httpRequest.setRequestHeader(
//     'Content-Type',
//     'application/x-www-form-urlencoded'
//   ); // リクエストヘッダーを追加(URIエンコードで送信)
//   httpRequest.send(params); // sendメソッドでサーバに送信
//   httpRequest.onreadystatechange = function () {
//     if (httpRequest.readyState === 4) {
//       // readyStateが4になればデータの読込み完了
//       console.log('4');
//       if (httpRequest.status === 200) {
//         // statusが200の場合はリクエストが成功
//         console.log('200');
//         //console.log(httpRequest.responseText);
//         //const datastringify = JSON.stringify(httpRequest.responseText);
//         //console.log('datastringify:' + typeof datastringify);
//         //const dataJson = JSON.parse(datastringify);
//         //console.log('dataJson:' + typeof dataJson);
//         //console.log(dataJson);
//         callBackFunction(
//           JSON.parse(httpRequest.responseText),
//           callBackFunctionArg
//         );
//       } else {
//         // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
//         // console.log(httpRequest.responseText);
//         const errs = JSON.parse(httpRequest.responseText);
//         // console.log(errs);
//         let errMassage = '';
//         errs.details.forEach(
//           (err) => (errMassage += err.target + ': ' + err.message + '\n')
//         );
//         // console.log(errMassage);
//         alert(errMassage);
//       }
//     }
//   };
// }

/**
 * ajax通信時のコールバックファンクション実行方法：並列
 *
 *  @type {string}
 */
export const PARALLEL: string = 'parallel';

/**
 * ajax通信時のコールバックファンクション実行方法：直列
 *
 *  @type {string}
 */
export const SERIES: string = 'series';

/**
 * ajaxで非同期通信を行う(Promiseでラップした通信結果を返却)
 * ajaxの通信結果を引数にとる実行したいファンクションをこのメソッドの引数に指定することで、実行可能
 * functionは配列に詰めることで添え字が小さい順から順に実行される
 *
 * @param {string} method -通信方法('GET' or 'POST')
 * @param {string} url -送信先url
 * @param {Document | XMLHttpRequestBodyInit} body -送信時にセットするパラメーター 省略可能
 * @param {string} type -実行方法{並列 : 'parallel', 直列 : 'series'} 省略可能
 * @param {any} functions -実行したい引数に取得したjsonオブジェクトをとる関数たちを指定  省略可能
 * @param {Object[]} functionArgs -functionsに追加で渡す引数 functionsの配列の添え字に合わせることでfunctionsに渡される 省略可能
 * @return -結果が格納された「Promise」オブジェクト
 */
export function ajax(
  method: string,
  url: string,
  body: Document | XMLHttpRequestBodyInit = '',
  type: string = SERIES,
  functions: any = [],
  functionArgs: Object[] = []
): Promise<unknown> {
  //ajax送信を行い結果を配列に格納
  let ajaxPromise: Promise<unknown> = new Promise(function (resolve, reject) {
    let httpRequest: XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequestのインスタンス作成
    //CSRFトークンをセットで送信
    // let csrfToken = {};
    // csrfToken[getCsrfTokenParmName()] = getCsrfToken();
    // const csrfUrl = addUrlParms(url, csrfToken);
    httpRequest.open(method, url, true); // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
    httpRequest.setRequestHeader(getCsrfTokenHeader(), getCsrfToken()); // リクエストヘッダーを追加(CSRFトークンをセットで送信)
    httpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    ); // リクエストヘッダーを追加(URIエンコードで送信)
    httpRequest.send(body); // sendメソッドでサーバに送信
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        // readyStateが4になればデータの読込み完了
        console.log('4');
        if (httpRequest.status === 200) {
          // statusが200の場合はリクエストが成功
          console.log('200');
          //console.log(httpRequest.responseText);
          //const datastringify = JSON.stringify(httpRequest.responseText);
          //console.log('datastringify:' + typeof datastringify);
          //const dataJson = JSON.parse(datastringify);
          //console.log('dataJson:' + typeof dataJson);
          //console.log(dataJson);
          //console.log(JSON.parse(httpRequest.responseText));
          resolve(JSON.parse(httpRequest.responseText));
        } else {
          // statusが200以外の場合はリクエストが適切でなかったとしてサーバーから帰ってきたエラー情報を取得し返却
          let messages: string = '';
          console.log(httpRequest.responseText);
          if (400 <= httpRequest.status && httpRequest.status <= 499) {
            // return 結果が json形式か判定
            const contentType: string =
              httpRequest.getResponseHeader('Content-Type');
            if (contentType != null && contentType.indexOf('json') != -1) {
              const json = JSON.parse(httpRequest.responseText);
              console.log(json);
              console.log(json.errorResults);
              json.errorResults.forEach((errorResult) => {
                console.log(errorResult);
                messages += '<div>' + errorResult.message + '</div>';
              });
            } else {
              messages = '<div>' + httpRequest.statusText + '</div>';
            }
          } else {
            messages = '<div>' + 'System error occurred.' + '</div>';
          }
          //console.log(httpRequest.responseText);
          //console.log(JSON.parse(httpRequest.responseText));
          reject(messages);
        }
      }
    };
  });

  //functionsが配列でなかった場合、配列化する
  if (!Array.isArray(functions)) {
    functions = [functions];
    functionArgs = [functionArgs];
  }
  // 追加の処理の実施
  // 並列実行
  if (type === PARALLEL) {
    if (functions.length > 0) {
      ajaxPromise = ajaxPromise.then(
        //前の処理が成功した時
        function (response) {
          //Promise.allを使用して並列実行
          return Promise.all(
            functions.map(function (func, i) {
              return new Promise(function (fulfilled, rejected) {
                //追加の引数があるかどうかを判定(jsはnull判定をifの条件に指定するだけで勝手にやってくれる)
                if (functionArgs[i]) {
                  //追加の引数指定があったとき
                  func(response, functionArgs[i]);
                } else {
                  //追加の引数指定がなかった時
                  func(response);
                }
                fulfilled(response);
              });
            })
          );
        },
        //前の処理がエラーの時はthrowを行い後続の処理を実行しないようにする
        function (error) {
          throw new Error(error);
        }
      );
    }
  } else {
    //直列実行
    for (let i = 0; i < functions.length; i++) {
      ajaxPromise = ajaxPromise.then(
        //前の処理が成功した時
        function (response) {
          //追加の引数があるかどうかを判定(jsはnull判定をifの条件に指定するだけで勝手にやってくれる)
          if (functionArgs[i]) {
            //追加の引数指定があったとき
            functions[i](response, functionArgs[i]);
          } else {
            //追加の引数指定がなかった時
            functions[i](response);
          }
          return response;
        },
        //前の処理がエラーの時はthrowを行い後続の処理を実行しないようにする
        function (error) {
          throw new Error(error);
        }
      );
    }
  }

  return ajaxPromise;
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
 * form上でのデータ通信をjsを使用して行う(同期通信)
 *
 * @param {string} method -通信方法('GET' or 'POST')
 * @param {string} url -送信先url
 * @param {Object} params -送信時にセットするparam 省略可能
 */
export function submit(
  method: string,
  url: string,
  params: Object = null
): void {
  const submitMe: HTMLFormElement = document.createElement('form');
  submitMe.action = url; // Remember to change me
  submitMe.method = method;
  submitMe.type = 'hidden';
  submitMe.enctype = 'multipart/form-data';
  for (const key in params) {
    const output: HTMLInputElement = document.createElement('input');
    output.value = params[key];
    output.type = 'hidden';
    output.name = key;
    submitMe.appendChild(output);
  }
  //CSRF対策用トークン
  const csrfOutPut: HTMLInputElement = document.createElement('input');
  csrfOutPut.value = getCsrfToken();
  csrfOutPut.type = 'hidden';
  csrfOutPut.name = getCsrfTokenParmName();
  submitMe.appendChild(csrfOutPut);
  //bodeyに追加
  document.body.appendChild(submitMe);
  //送信
  submitMe.submit();
}

/**
 * 画面内に使用するための日付けを取得
 *
 * @return パラメータにセットされた日付け。なければ現在時刻。
 */
export function getStudyDate(): Date {
  // urlからパラメーターを取得
  const paaramDate: string = getLocationHrefParm('date');
  //dateパラメーターが設定されていたらそれを、設定されていなかったら本日の日付を設定
  const date: Date = paaramDate == null ? new Date() : new Date(paaramDate);

  return date;
}

/**
 * 日付けをyyyyMMdd形式に変換
 *
 * @param {Date} date 対象日付け
 * @param {string} delim 区切り文字
 * @return yyyyMMdd形式に変換された日付け
 */
export function formatDateBtYyyyMmDd(date: Date, delim: string = '/'): string {
  const result: string =
    delim == null
      ? String(date.getFullYear()) +
        String(date.getMonth() + 1) +
        String(date.getDate())
      : date.getFullYear() +
        delim +
        (date.getMonth() + 1) +
        delim +
        date.getDate();

  return result;
}

/**
 * 対象要素にまだ追加されていなかったら、追加
 * 追加されていたら置換
 *
 * @param {HTMLElement} target 追加対象html要素
 * @param {HTMLElement} child 追加html要素
 * @param {string} childType 追加html要素のタイプ
 */
export function appendOrReplaceChild(
  target: HTMLElement,
  child: HTMLElement,
  childType: string
): void {
  if (target.childElementCount > 0) {
    target.replaceChild(child, target.querySelector(childType));
  } else {
    target.appendChild(child);
  }
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
function isEmpty(obj: {}) {
  for (let i in obj) {
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
export async function fetchGet(baseurl: string, params: {} = {}) {
  const query = new URLSearchParams(params);
  const url = pathJoin(getContextPath(), baseurl);
  const res: Response = await window.fetch(
    isEmpty(params) ? url : url + '?' + query
  );
  if (!res.ok) {
    throw new Error(`unexpected status: ${res.status}`);
  }

  return res;
}

/**
 * post通信を行う
 * @param baseurl 通信先
 * @param body 送付パラム
 * @returns 通信結果
 */
export async function fetchPost(
  baseurl: string,
  body: {} = {}
): Promise<Response> {
  const headers = () => {
    const headers: {} = {};
    //headers['Content-Type'] = 'multipart/form-data';
    headers[getCsrfTokenHeader()] = getCsrfToken();
    return headers;
  };

  const data = new FormData();
  for (const key in body) {
    console.log(key);
    console.log(body[key]);
    if (body[key]) data.append(key, body[key]);
  }

  console.log(data);

  const res: Response = await window.fetch(
    pathJoin(getContextPath(), baseurl),
    {
      method: 'POST',
      headers: headers(),
      body: data,
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
 * サーバーでエラーがあった場合のエラーメッセージを取得
 * @param errData エラー結果格納変数
 * @param setErrData エラー結果格納変数更新メソッド
 * @returns エラーメッセージ
 */
export function getServerErrMsg(
  errData: ErrorResults,
  target: string,
  setErrData: (value: React.SetStateAction<{}>) => void
) {
  console.log('エラーメッセージ');
  console.log(errData);
  if (errData) {
    const errors = errData.errorResults;
    for (let i = 0; i < errors.length; ++i) {
      const FieldName = errors[i].itemPath;
      if (FieldName == target) {
        const cloneErrData = errData;
        // エラー配列から対象の初期化
        cloneErrData.errorResults[i].itemPath = '';
        setErrData(cloneErrData);
        return errors[i].message;
      }
    }
  }
  return 'エラーです';
}

/**
 * サーバーでエラーがあったかの判定を行う
 * @param errData エラー結果格納変数
 * @returns 判定結果
 */
export function isServerErr(errData: ErrorResults, target: string) {
  console.log(errData);
  if (errData) {
    const errors = errData.errorResults;
    console.log('エラー：' + errors);
    for (let i = 0; i < errors.length; ++i) {
      const FieldName = errors[i].itemPath;
      if (FieldName == target) {
        return false;
      }
    }
  }

  return true;
}

/**
 * inputのファイルを取得
 * @param event inputのチェンジイベント
 * @returns ファイル
 */
export function getInputFile(event: React.ChangeEvent<HTMLInputElement>) {
  return event.currentTarget.files !== null
    ? event.currentTarget.files[0]
    : null;
}
