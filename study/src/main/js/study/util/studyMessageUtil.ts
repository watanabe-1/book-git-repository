import { Type, Flag } from '../../@types/studyUtilType';
import { TypeConst } from '../../constant/typeConstant';

/**
 * 確認画面用のメッセージを返却
 *
 * @param value 入力内容
 * @param type 入力タイプ
 * @return 確認画面メッセージ
 */
export function getConfirmMessage(
  value: string,
  type: string,
  convert: { typeList: Type[]; flag: Flag }
) {
  // select or radio
  if (type == TypeConst.Col.SELECT || type == TypeConst.Col.RADIO) {
    return value
      ? convert.typeList.find((type) => type.code == value).name
      : '選択してません';
  }
  // checkBox
  if (type == TypeConst.Col.CHECK) {
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
