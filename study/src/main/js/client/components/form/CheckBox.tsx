import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './FormControl';
import { Flag } from '../../../@types/studyUtilType';
import { typeConst } from '../../../constant/typeConstant';
import { getConfirmMessage } from '../../../study/util/studyMessageUtil';
import { isNumber } from '../../../study/util/studyUtil';

type CheckBoxProps = {
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string;
  /** フラグ */
  flag: Flag;
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** テキストボックスを非表示にするかどうか */
  hidden?: boolean;
  /** バリデーションを行うかどうかを示すフラグ */
  validate?: boolean;
  /** バリデーションが実行されたかどうかを示すフラグ */
  touched?: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
  /** 読み取り専用にするか */
  isReadonly?: boolean;
  /** ラベルを表示しない */
  noLabel?: boolean;
  /** ラベルにテキストバリューを使用するか */
  isLabelTextValue?: boolean;
};

/**
 * checkbox初期値設定用関数
 *
 * @param value 値
 * @returns
 */
export const modifierCheckBox = (value: string) => {
  const isChecked = Boolean(isNumber(value) ? Number(value) : value);
  if (isChecked) {
    return ['1'];
  }
  return [];
};

/**
 * 選択肢の表示値を取得
 *
 * @param flag チェック選択フラグ
 * @param code 取得したい選択肢のコード
 */
export const getCheckBoxTextValue = (flag: Flag, code) => {
  return getConfirmMessage(code, typeConst.col.CHECK, {
    typeList: null,
    flag: flag,
  });
};

/**
 * 選択肢の表示値を取得
 *
 * @param flag チェック選択フラグ
 * @param code 取得したい選択肢のコード
 */
export const getCheckBoxLabelValue = (
  flag: Flag,
  text: string,
  isLabelTextValue = true
) => {
  return isLabelTextValue ? text : flag.name;
};

/**
 *
 * @returns form内のチェックボックス
 */
const CheckBox: React.FC<CheckBoxProps> = ({
  name,
  value,
  flag,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  isReadonly = false,
  noLabel = false,
  isLabelTextValue = true,
}) => {
  const text = getCheckBoxTextValue(flag, value);
  const label = noLabel
    ? null
    : getCheckBoxLabelValue(flag, text, isLabelTextValue);
  // console.log(`${name}-${value}`);

  return (
    <FormControl
      name={name}
      value={value}
      textValue={text}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
      isReadonly={isReadonly}
    >
      {
        // チェックボックスは1つのみで使用する想定のため長さ1の配列でループ
        Array.from({ length: 1 }).map((_, rowIndex) => {
          const id = `${name}-${rowIndex}`;

          return (
            <Form.Check
              key={id}
              type="checkbox"
              label={label}
              value={flag.value}
              // flagに入る値(1,true)などどちらも対応できるように===は使用しない
              checked={flag.value == value}
            />
          );
        })
      }
    </FormControl>
  );
};

export default CheckBox;
