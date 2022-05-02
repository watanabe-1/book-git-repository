/**
 * aタグにセットされているhref属性にパラメーターをセットする共通関数
 * @param {string} aTagQualifiedName - aタグ一意に指定できるquerySelectorのelement
 * @param {string} paramName - パラメーター名
 * @param {string} param - パラメーター値
 */
function setAtagHrefParm(aTagQualifiedName, paramName, param) {
  const target = document.querySelector(aTagQualifiedName);
  const href = target.getAttribute('href');
  const baseUrl = getBaseUrl();
  const url = new URL(href, baseUrl);
  url.searchParams.set(paramName, param);
  //別に置換しなくても絶対urlがaタグにセットされるだけだけど見た目的に一応置換して相対urlに
  const newHref = url.href.replace(baseUrl, '');

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
 * @param {string} aTagQualifiedName - aタグ一意に指定できるquerySelectorのelement
 * @param {JSON} params - {パラメータ名: パラメーター値}
 */
function setAtagHrefParms(aTagQualifiedName, params) {
  const target = document.querySelector(aTagQualifiedName);
  const href = target.getAttribute('href');
  const baseUrl = getBaseUrl();
  const url = new URL(href, baseUrl);
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
  const newHref = url.href.replace(baseUrl, '');

  target.setAttribute('href', newHref);
  return newHref;
}

/**
 * 文字列の中の正規表現などをエスケープする
 * @param {string} string - エスケープ対象
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&'); // $&はマッチした部分文字列全体を意味します
}

/**
 * urlのプロトコルからホストまでを取得
 */
function getBaseUrl() {
  return location.protocol + '//' + location.host;
}

/**
 * urlの初期部分を取得
 */
function getFirstUrl() {
  const target = document.querySelector('#firstLink');
  return target.getAttribute('href');
}

/**
 * urlのパラメーターを取得
 * @param {string} paramName - パラメーター名
 */
function getLocationHrefParm(paramName) {
  // URLを取得
  const url = new URL(window.location.href);
  // URLSearchParamsオブジェクトを取得
  const params = url.searchParams;
  // getメソッド
  const param = params.get(paramName);
  return param;
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
//         //const dataStringify = JSON.stringify(httpRequest.responseText);
//         //console.log('dataStringify:' + typeof dataStringify);
//         //const dataJson = JSON.parse(dataStringify);
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
const PARALLEL = 'parallel';

/**
 * ajax通信時のコールバックファンクション実行方法：直列
 *
 *  @type {string}
 */
const SERIES = 'series';

/**
 * ajaxで非同期通信を行う(Promiseでラップした通信結果を返却)
 * ajaxの通信結果を引数にとる実行したいファンクションをこのメソッドの引数に指定することで、実行可能
 * functionは配列に詰めることで添え字が小さい順から順に実行される
 *
 * @param {string} method -通信方法('GET' or 'POST')
 * @param {string} url -送信先url
 * @param {string} params -送信時にセットするパラメーター 省略可能
 * @param {string} type -実行方法{並列 : 'parallel', 直列 : 'series'} 省略可能
 * @param {function[]} functions -実行したい引数に取得したjsonオブジェクトをとる関数たちを指定  省略可能
 * @param {any[]} functionArgs -functionsに追加で渡す引数 functionsの配列の添え字に合わせることでfunctionsに渡される 省略可能
 * @return -結果が格納された「Promise」オブジェクト
 */
function ajax(
  method,
  url,
  params = '',
  type = SERIES,
  functions = [],
  functionArgs = []
) {
  //ajax送信を行い結果を配列に格納
  let ajaxPromise = new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest(); // XMLHttpRequestのインスタンス作成
    httpRequest.open(method, url, true); // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
    httpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    ); // リクエストヘッダーを追加(URIエンコードで送信)
    httpRequest.send(params); // sendメソッドでサーバに送信
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        // readyStateが4になればデータの読込み完了
        console.log('4');
        if (httpRequest.status === 200) {
          // statusが200の場合はリクエストが成功
          console.log('200');
          //console.log(httpRequest.responseText);
          //const dataStringify = JSON.stringify(httpRequest.responseText);
          //console.log('dataStringify:' + typeof dataStringify);
          //const dataJson = JSON.parse(dataStringify);
          //console.log('dataJson:' + typeof dataJson);
          //console.log(dataJson);
          //console.log(JSON.parse(httpRequest.responseText));
          resolve(JSON.parse(httpRequest.responseText));
        } else {
          // statusが200以外の場合はリクエストが適切でなかったとしてサーバーから帰ってきたエラー情報を取得し返却
          reject(getErrMsg(JSON.parse(httpRequest.responseText)));
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
 * サーバーから帰ってきたエラーから画面に表示するようのメッセージの加工して返却
 *
 * @param {JSON} errJson -サーバーから帰ってきたエラー
 */
function getErrMsg(errJson) {
  //console.log(errJson);
  let errMassage = '';
  if (errJson.details) {
    errMassage = errJson.details
      .map(function (err) {
        return err.target + ': [' + err.code + ']' + err.message;
      })
      .join('\n');
  } else {
    errMassage = '[' + errJson.code + ']' + errJson.message;
  }
  return errMassage;
}

/**
 * form上でのデータ通信をjsを使用して行う(同期通信)
 *
 * @param {string} method -通信方法('GET' or 'POST')
 * @param {string} url -送信先url
 * @param {JSON} params -送信時にセットするparam 省略可能
 */
function submit(method, url, params = '') {
  const submitMe = document.createElement('form');
  submitMe.action = url; // Remember to change me
  submitMe.method = method;
  submitMe.type = 'hidden';
  submitMe.enctype = 'multipart/form-data';
  for (const key in params) {
    const output = document.createElement('input');
    output.value = params[key];
    output.type = 'hidden';
    output.name = key;
    submitMe.appendChild(output);
  }
  //bodeyに追加
  document.body.appendChild(submitMe);
  //送信
  submitMe.submit();
}

/**
 * 画面内に使用するための日付けを取得
 *
 */
function getStudyDate() {
  // urlからパラメーターを取得
  const paaramDate = getLocationHrefParm('date');
  //dateパラメーターが設定されていたらそれを、設定されていなかったら本日の日付を設定
  const date = paaramDate == null ? new Date() : new Date(paaramDate);

  return date;
}

/**
 * 日付けをyyyyMMdd形式に変換
 *
 * @param {Date} date 対象日付け
 * @param {String} delim 区切り文字
 */
function formatDateBtYyyyMmDd(date, delim = null) {
  //日付け型ではなかったら
  if (typeof date != 'Date') {
    date = new Date(date);
  }
  const result =
    delim == null
      ? date.getFullYear() + (date.getMonth() + 1) + date.getDate()
      : date.getFullYear() +
        delim +
        (date.getMonth() + 1) +
        delim +
        date.getDate();

  return result;
}
