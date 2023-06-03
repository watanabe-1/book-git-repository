import * as yup from 'yup';

import { ErrorResults } from '../../@types/studyUtilType';
import { commonConst } from '../../constant/commonConstant';
import {
  getServerErr,
  extractAndDeleteServerErrMsg,
} from '../../study/util/studyYupUtil';

/**
 * サーバーでのバリデーション結果を取得するバリデーターを定義
 *
 * @param errData
 * @param param1
 * @returns
 */
const serverValidator = (
  errData: ErrorResults,
  { path, createError }: yup.TestContext<yup.AnyObject>
) => {
  //console.log(errData);
  const error = getServerErr(errData, path);
  if (error) {
    console.log(`server error key:${path}`);
    console.log(error);
    return createError({
      path,
      message: extractAndDeleteServerErrMsg(error),
    });
  } else return true;
};

/**
 * サーバーでのバリデーション結果を取得するメソッドをスキーマに付与する
 *
 * @param schema
 * @param errData
 * @returns
 */
const addServerMethod = <T extends yup.Schema<unknown>>(
  schema: T,
  errData: ErrorResults
): T =>
  schema.test(commonConst.SERVER_TEST_NAME, (value, context) => {
    return serverValidator(errData, context);
  }) as T;

// yup.string スキーマーに対して 'server'メソッドを追加
yup.addMethod(
  yup.string,
  commonConst.SERVER_TEST_NAME,
  function (errData: ErrorResults) {
    return addServerMethod(this, errData);
  }
);

// yup.number スキーマーに対して 'server'メソッドを追加
yup.addMethod(
  yup.number,
  commonConst.SERVER_TEST_NAME,
  function (errData: ErrorResults) {
    return addServerMethod(this, errData);
  }
);

// yup.boolean スキーマーに対して 'server'メソッドを追加
yup.addMethod(
  yup.boolean,
  commonConst.SERVER_TEST_NAME,
  function (errData: ErrorResults) {
    return addServerMethod(this, errData);
  }
);

// yup.mixed スキーマーに対して 'server'メソッドを追加
yup.addMethod(
  yup.mixed,
  commonConst.SERVER_TEST_NAME,
  function (errData: ErrorResults) {
    return addServerMethod(this, errData);
  }
);

// yup.object スキーマーに対して 'server'メソッドを追加
yup.addMethod(
  yup.object,
  commonConst.SERVER_TEST_NAME,
  function (errData: ErrorResults) {
    return addServerMethod(this, errData);
  }
);

// yup.date スキーマーに対して 'server'メソッドを追加
yup.addMethod(
  yup.date,
  commonConst.SERVER_TEST_NAME,
  function (errData: ErrorResults) {
    return addServerMethod(this, errData);
  }
);

export default yup;
