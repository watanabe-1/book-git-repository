import React from 'react';
import Form from 'react-bootstrap/Form';

import { Type } from '../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../study/util/studyUtil';

/**
 * @param title - テキストボックスのタイトル
 * @param name - テキストボックスの名前
 * @param value - テキストボックスの値
 * @param typeList - 選択しのリスト
 * @param isUnshiftEmpty - 選択しの先頭に空の選択しを追加するか
 * @param onChange - テキストボックスの値が変更されたときのハンドラ関数
 * @param hidden - テキストボックスを非表示にするかどうか
 * @param validate - バリデーションを行うかどうかを示すフラグ
 * @param touched - バリデーションが実行されたかどうかを示すフラグ
 * @param error - エラーメッセージ
 * @returns form内のセレクトボックス(バリデーションあり)
 */
const SelectBox = ({
  title = null,
  name,
  value,
  typeList,
  isUnshiftEmpty = false,
  onChange,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
}: {
  title?: string;
  name: string;
  value: string;
  typeList: Type[] | string[];
  isUnshiftEmpty?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  hidden?: boolean;
  validate?: boolean;
  touched?: unknown;
  error?: unknown;
}) => {
  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;
  const newTypeList = ToTypeArrayIfIsStringArray(typeList);

  //先頭に空要素を追加
  if (isUnshiftEmpty) {
    newTypeList.unshift({
      code: '',
      name: '選択してください',
    });
  }
  return (
    <Form.Group controlId={name}>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Select
        name={name}
        onChange={onChange}
        hidden={hidden}
        isValid={isValid}
        isInvalid={isInvalid}
      >
        {newTypeList.map((type, i) => (
          <option
            key={`${type.code}-${i}`}
            selected={type.code == value}
            value={type.code}
          >
            {type.name}
          </option>
        ))}
      </Form.Select>
      {validate && <Form.Control.Feedback>OK!</Form.Control.Feedback>}
      {validate && (
        <Form.Control.Feedback type="invalid">
          {error as string}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default SelectBox;
