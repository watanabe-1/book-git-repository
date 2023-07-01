import React from 'react';
import Form from 'react-bootstrap/Form';

import { Type } from '../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../study/util/studyUtil';
import FormControl from './FormControl';

type SelectBoxProps = {
  title?: string;
  name: string;
  value: string;
  typeList: Type[] | string[];
  isUnshiftEmpty?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  hidden?: boolean;
  validate?: boolean;
  touched?: unknown;
  error?: unknown;
  dirty?: boolean;
  isOnClickEditable?: boolean;
};

/**
 * @param title - テキストボックスのタイトル
 * @param name - テキストボックスの名前
 * @param value - テキストボックスの値
 * @param typeList - 選択しのリスト
 * @param isUnshiftEmpty - 選択しの先頭に空の選択しを追加するか
 * @param onChange - テキストボックスの値が変更されたときのハンドラ関数
 * @param onBlur - テキストボックスからフォーカスが外れた時のハンドラ関数
 * @param hidden - テキストボックスを非表示にするかどうか
 * @param validate - バリデーションを行うかどうかを示すフラグ
 * @param touched - バリデーションが実行されたかどうかを示すフラグ
 * @param error - エラーメッセージ
 * @param dirty - formが変更されたかどうか
 * @param isOnClickEditable - 通常は文字のみでクリックしたときに入力できるようにする
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
}) => {
  const newTypeList = ToTypeArrayIfIsStringArray(typeList);
  //先頭に空要素を追加
  if (isUnshiftEmpty) {
    newTypeList.unshift({
      code: '',
      name: '選択してください',
    });
  }
  const selectedType = newTypeList.find((type) => type.code == value);

  return (
    <FormControl
      title={title}
      name={name}
      value={value}
      textValue={selectedType ? selectedType.name : ''}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
    >
      <Form.Select>
        {newTypeList.map((type) => (
          <option
            key={type.code}
            selected={type.code === value}
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
