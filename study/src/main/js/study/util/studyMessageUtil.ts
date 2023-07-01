import { Type, Flag } from '../../@types/studyUtilType';
import { typeConst } from '../../constant/typeConstant';

/**
 * 確認画面用のメッセージを返却
 *
 * @param value 入力内容
 * @param type 入力タイプ
 * @param convert 変換内容
 * @return 確認画面メッセージ
 */
export function getConfirmMessage(
  value: string,
  type: string,
  convert: { typeList: Type[]; flag: Flag }
) {
  // select or radio
  if (type === typeConst.col.SELECT || type === typeConst.col.RADIO) {
    return value
      ? convert.typeList.find((type) => type.code === value).name
      : '選択してません';
  }
  // checkBox
  if (type === typeConst.col.CHECK) {
    // flagに入る値(1,true)などどちらも対応できるように===は使用しない
    return value == convert.flag.value
      ? convert.flag.name
      : 'チェックしてません';
  }
  // 入力なし
  if (!value) {
    return '未入力';
  }
  return value;
}
