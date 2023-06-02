import React from 'react';
import Form from 'react-bootstrap/Form';
import { Type } from '../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../study/util/studyUtil';

/**
 *
 * @returns form内のセレクトボックス
 */
const SelectBox = ({
  title = null,
  name,
  value,
  typeList,
  onChange,
  isUnshiftEmpty = false,
}: {
  title?: string;
  name: string;
  value: string;
  typeList: Type[] | String[];
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
      <Form.Select name={name} onChange={onChange}>
        {newTypeList.map((type) => (
          <option selected={type.code == value} value={type.code}>
            {type.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectBox;
