import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './FormControl';
import { Type } from '../../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../../study/util/studyUtil';

type SelectBoxProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string;
  /** 選択肢のリスト */
  typeList: Type[] | string[];
  /** 選択肢の先頭に空の選択肢を追加するかどうか */
  isUnshiftEmpty?: boolean;
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
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
};

/**
 * typeListの取得
 *
 * @param baseList 選択肢のリスト
 * @param isUnshiftEmpty 選択肢の先頭に空の選択肢を追加するかどうか
 * @returns
 */
export const getSelectBoxTypeList = (
  baseList: Type[] | string[],
  isUnshiftEmpty: boolean = false
) => {
  const typeList = ToTypeArrayIfIsStringArray(baseList);
  //先頭に空要素を追加
  if (isUnshiftEmpty) {
    typeList.unshift({
      code: '',
      name: '選択してください',
    });
  }
  return typeList;
};

/**
 * 選択肢の表示値を取得
 *
 * @param typeList 選択肢のリスト
 * @param code 取得したい選択肢のコード
 */
export const getSelectBoxTextValue = (typeList: Type[], code) => {
  const textValue = typeList.find((type) => type.code === code)?.name;

  return textValue ? textValue : '';
};

/**
 *
 * @returns form内のセレクトボックス(バリデーションあり)
 */
const SelectBox: React.FC<SelectBoxProps> = ({
  title = null,
  name,
  value,
  typeList,
  isUnshiftEmpty = false,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  isReadonly = false,
}) => {
  const newTypeList = getSelectBoxTypeList(typeList, isUnshiftEmpty);
  const textValue = getSelectBoxTextValue(newTypeList, value);

  return (
    <FormControl
      title={title}
      name={name}
      value={value || ''}
      textValue={textValue}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
      readonly={isReadonly}
    >
      <Form.Select>
        {newTypeList.map((type) => (
          <option
            key={type.code}
            //reactはselected非推奨なため使用しない
            //selected={type.code === value}
            value={type.code}
          >
            {type.name}
          </option>
        ))}
      </Form.Select>
    </FormControl>
  );
};

export default SelectBox;
