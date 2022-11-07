import BaseSchema from 'yup/lib/schema';
import { AnyObject, ObjectShape } from 'yup/lib/object';
import { getServerErrMsg, isServerErr } from './studyUtil';
import { CommonConst } from '../../constant/commonConstant';
import { ErrorResults } from '../../@types/studyUtilType';

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
