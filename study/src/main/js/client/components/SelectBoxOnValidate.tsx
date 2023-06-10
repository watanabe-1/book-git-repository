import React from 'react';
import Form from 'react-bootstrap/Form';

import { Type } from '../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../study/util/studyUtil';

/**
 *
 * @returns form内のセレクトボックス(バリデーションあり)
 */
const SelectBoxOnValidate = ({
  title = null,
  name,
  value,
  typeList,
  touched,
  error,
  onChange,
  isUnshiftEmpty = false,
}: {
  title?: string;
  name: string;
  value: string;
  typeList: Type[] | string[];
  touched: unknown;
  error: unknown;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isUnshiftEmpty?: boolean;
}) => {
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
        isValid={touched && !error}
        isInvalid={!!error}
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
      <Form.Control.Feedback>OK!</Form.Control.Feedback>
      <Form.Control.Feedback type="invalid">
        {
          // エラー回避 対応策わかり次第変更
          error as string
        }
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default SelectBoxOnValidate;
