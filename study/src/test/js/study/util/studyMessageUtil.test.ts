import { typeConst } from '../../../../main/js/constant/typeConstant';
import { getConfirmMessage } from '../../../../main/js/study/util/studyMessageUtil';

describe('getConfirmMessage', () => {
  const typeList = [
    { code: '001', name: 'タイプ1' },
    { code: '002', name: 'タイプ2' },
  ];
  const flag = { value: '1', name: 'フラグあり' };

  test('should return name for SELECT type with valid value', () => {
    expect(
      getConfirmMessage('001', typeConst.col.SELECT, { typeList, flag })
    ).toBe('タイプ1');
  });

  test('should return "選択してません" for SELECT type with invalid value', () => {
    expect(
      getConfirmMessage('', typeConst.col.SELECT, { typeList, flag })
    ).toBe('選択してません');
  });

  test('should return flag name for CHECK type with matching value', () => {
    expect(
      getConfirmMessage('1', typeConst.col.CHECK, { typeList, flag })
    ).toBe('フラグあり');
  });

  test('should return "チェックしてません" for CHECK type with non-matching value', () => {
    expect(
      getConfirmMessage('0', typeConst.col.CHECK, { typeList, flag })
    ).toBe('チェックしてません');
  });

  test('should return "未入力" for empty value', () => {
    expect(getConfirmMessage('', null, { typeList, flag })).toBe('未入力');
  });

  test('should return original value for types other than SELECT or CHECK', () => {
    expect(
      getConfirmMessage('任意のテキスト', null, {
        typeList,
        flag,
      })
    ).toBe('任意のテキスト');
  });
});
