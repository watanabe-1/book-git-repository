import BaseSchema from 'yup/lib/schema';
import { AnyObject, ObjectShape } from 'yup/lib/object';
import { CommonConst } from '../../constant/commonConstant';
import {
  ErrorResults,
  buildListTableFormObjConfig,
} from '../../@types/studyUtilType';
import { format, keyJoin } from './studyUtil';

/**
 * サーバーでバリデーションを行った結果を反映するようの関数をyupにセット
 *
 * @param yup yup
 * @param target 対象変数名
 * @param errData エラー結果格納変数
 * @param setErrData エラー結果格納変数更新メソッド
 */
export function addServerValidateFunc(
  yup: BaseSchema<string, AnyObject, string>,
  target: string,
  errData: ErrorResults,
  setErrData: (value: React.SetStateAction<{}>) => void
) {
  return yup.test(
    CommonConst.SERVER_TEST_NAME,
    () => {
      return getServerErrMsg(errData, target, setErrData);
    },
    (value) => {
      return isServerErr(errData, target);
    }
  );
}

/**
 * サーバーでバリデーションを行った結果を反映するようの関数をyupにセット
 *
 * @param additions yupが定義されているオブジェクト
 * @param targets 対象変数名達
 * @param errData エラー結果格納変数
 * @param setErrData エラー結果格納変数更新メソッド
 */
export function addServerValidateFuncs(
  additions: { [x: string]: BaseSchema<string, AnyObject, string> },
  targets: string[],
  errData: ErrorResults,
  setErrData: (value: React.SetStateAction<{}>) => void
) {
  targets.forEach((target) => {
    additions[target] = addServerValidateFunc(
      additions[target],
      target,
      errData,
      setErrData
    );
  });
}

/**
 * サーバーでエラーがあった場合のエラーメッセージを取得
 * @param errData エラー結果格納変数
 * @param key エラー対象判別用key
 * @param setErrData エラー結果格納変数更新メソッド
 * @returns エラーメッセージ
 */
export function getServerErrMsg(
  errData: ErrorResults,
  key: string,
  setErrData: (value: React.SetStateAction<{}>) => void
) {
  console.log('エラーメッセージ');
  console.log(errData);
  // buildEscapeListItemIdメソッドでkeyを作成していたら変換
  const formattedKey = formatEscapeListItemId(key);
  if (errData) {
    const errors = errData.errorResults;
    for (let i = 0; i < errors.length; ++i) {
      const FieldName = errors[i].itemPath;
      if (FieldName == formattedKey) {
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
 * @param key エラー対象判別用key
 * @returns 判定結果
 */

export function isServerErr(errData: ErrorResults, key: string) {
  console.log(errData);
  // buildEscapeListItemIdメソッドでkeyを作成していたら変換
  const formattedKey = formatEscapeListItemId(key);
  if (errData) {
    const errors = errData.errorResults;
    console.log('エラー：' + errors);
    for (let i = 0; i < errors.length; ++i) {
      const FieldName = errors[i].itemPath;
      if (FieldName == formattedKey) {
        return false;
      }
    }
  }

  return true;
}

/**
 * リスト表示用のエスケープ済みの一意の名称の取得
 * @param classname クラス名
 * @param base ベース
 * @param index インデックス
 * @returns
 */
export function buildEscapeListItemId(
  classname: string,
  base: string,
  index: number
) {
  return (
    classname +
    CommonConst.FORMAT_SPECIFIER +
    index +
    CommonConst.FORMAT_SPECIFIER +
    base.replace(/\./g, CommonConst.FORMAT_SPECIFIER)
  );
}

/**
 * エスケープをおこなっていたbuildEscapeListItemIdからサーバーに返却用のIDに変換
 * @param escapeListItemId  対象
 * @param args 変換用引数
 * @returns 返還後の値
 */
export function formatEscapeListItemId(escapeListItemId: string) {
  const args = escapeListItemId
    .split(CommonConst.FORMAT_SPECIFIER)
    .map((target, index) => {
      if (index == 0) {
        return '[';
      } else if (index == 1) {
        return '].';
      } else {
        return '.';
      }
    });
  // console.log('format:' + j);
  return format(escapeListItemId, args);
}

/**
 * オブジェクトの並列探索を行いFormDataに変換
 * @param obj 対象
 * @return FormData
 */
export function objToFormData(obj: {}) {
  const data = new FormData();
  let stack = [];

  stack.push(obj);

  while (stack.length) {
    for (const j in stack[0]) {
      if (
        stack[0][j] &&
        stack[0][j].constructor === Object &&
        !stack[0][j].length
      ) {
        // console.log(`pushu側${j} : ${stack[0][j]}`);
        const childStack = {};
        for (const k in stack[0][j]) {
          // 再帰的に検索する場合key情報を引き継ぐ
          childStack[keyJoin(j, k)] = stack[0][j][k];
        }
        // 取得結果がobjectの場合は再帰的に探索するため対象に改めて追加
        stack.push(childStack);
      } else {
        // console.log(`${j} : ${stack[0][j]}`);
        // buildEscapeListItemIdメソッドでkeyを作成していたら変換
        const formattedKey = formatEscapeListItemId(j);
        // console.log('formatted:' + formattedKey);
        // 中身がないものはおくらない
        if (stack[0][j]) {
          // console.log('type:' + Object.prototype.toString.call(stack[0][j]));
          // かぶりは上書き(基本的にかぶりはない想定)
          data.set(formattedKey, stack[0][j]);
        }
      }
    }
    stack.shift();
  }
  return data;
}

/**
 * buildListTableFormObjメソッドでobj[]からobjに変換したobjをobj[]に変換
 * @param obj 対象
 * @return 配列
 */
export function objToObjArray(obj: {}) {
  let objArray: {}[] = [];
  for (const key in obj) {
    const keyArray = key.split(CommonConst.FORMAT_SPECIFIER);
    if (keyArray.length > 1) {
      let newObj = {};
      // console.log(keyArray);
      keyArray.forEach((value, index) => {
        if (index == 1) {
          // console.log(value);
          if (objArray[value]) {
            newObj = objArray[value];
          } else {
            objArray[value] = newObj;
          }
        } else if (index >= 2) {
          // console.log(JSON.stringify(newObj[value]));
          // console.log(JSON.stringify(objArray));
          if (newObj[value]) {
            newObj = newObj[value];
          } else {
            newObj[value] = {};
          }
          // 最終周の時
          if (keyArray.length - 1 == index) {
            // 他の項目とかぶりが生じた場合はそれはオブジェクトではなくなっているので
            //判定を行うが基本的にかぶりが起きないように収支済みのためかぶりない想定
            // またかぶりがあった場合は上書き
            if (newObj && newObj.constructor === Object) {
              newObj[value] = obj[key];
            } else {
              newObj = obj[key];
            }
          }
        }
      });
    }
  }
  console.log(objArray);
  return objArray;
}

/**
 * リストテーブルフォーム画面用にobj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
 *
 * @param objArray オブジェクト配列
 * @param config 設定
 * @returns ビルドしたオブジェクト
 */
export function buildListTableFormObj(
  objArray: {}[],
  config: buildListTableFormObjConfig
) {
  // //yupで使用するスキーマの設定
  const additions = {};
  // 初期値
  const initialValues = {};
  // リスト表示用一意の識別名称
  const nameList: {}[] = [];
  objArray.forEach((obj, index) => {
    const names = {};
    let stack = [];

    stack.push(obj);

    while (stack.length) {
      for (const j in stack[0]) {
        // 設定を取得
        const mutchconfig = config.list.find((config) => config.name == j);
        if (
          stack[0][j] &&
          stack[0][j].constructor === Object &&
          !stack[0][j].length
        ) {
          // console.log(`pushu側${j} : ${stack[0][j]}`);
          const childStack = {};
          for (const k in stack[0][j]) {
            // 再帰的に検索する場合key情報を引き継ぐ
            childStack[keyJoin(j, k)] = stack[0][j][k];
          }
          // 取得結果がobjectの場合は再帰的に探索するため対象に改めて追加
          stack.push(childStack);
        } else {
          // console.log(j);
          names[j] = buildEscapeListItemId(config.className, j, index);
          // 個別の設定が指定されていなかったらform更新可能データ対象外
          if (mutchconfig) {
            // console.log(j);
            // スキーマ設定用
            if (
              mutchconfig &&
              mutchconfig.addition &&
              mutchconfig.addition.yup
            ) {
              additions[names[j]] = mutchconfig.addition.yup;
              // サーバーでのバリデーション結果を反映する関数をセット
              if (mutchconfig.addition.isServerValidation) {
                addServerValidateFuncs(
                  additions,
                  [names[j]],
                  mutchconfig.addition.errData,
                  mutchconfig.addition.setErrData
                );
              }
            }
          }
          // 設定が指定されていなくても初期値として保持する(送り返すよう)
          // 初期値設定用
          initialValues[names[j]] = stack[0][j];
        }
      }
      stack.shift();
    }

    nameList[index] = names;
  });

  const result = {
    additions: additions,
    initialValues: initialValues,
    nameList: nameList,
  };

  console.log('nakami');
  console.log(result);

  return result;
}
