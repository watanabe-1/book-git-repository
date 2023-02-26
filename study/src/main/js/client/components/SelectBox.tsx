import React from 'react';
import Form from 'react-bootstrap/Form';
import { Type } from '../../@types/studyUtilType';

/**
 *
 * @returns form内のセレクトボックス
 */
const SelectBox = (props: {
  title: string;
  name: string;
  value: any;
  typeList: Type[];
  onChange;
}) => {
  return (
    <Form.Group controlId={props.name}>
      {props.title ? <Form.Label>{props.title}</Form.Label> : null}
      <Form.Select name={props.name} onChange={props.onChange}>
        {props.typeList.map((i) => (
          <option selected={i.code == props.value} value={i.code}>
            {i.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectBox;
