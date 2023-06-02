import React from 'react';
import Form from 'react-bootstrap/Form';
import { Type } from '../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../study/util/studyUtil';
import { FormikTouched } from 'formik';

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
  typeList: Type[] | String[];
  touched: FormikTouched<unknown>;
  error: any;
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
        {newTypeList.map((type) => (
          <option selected={type.code == value} value={type.code}>
            {type.name}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback>OK!</Form.Control.Feedback>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default SelectBoxOnValidate;
