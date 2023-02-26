import React from 'react';
import Form from 'react-bootstrap/Form';
import { Type } from '../../@types/studyUtilType';

/**
 *
 * @returns form内のラジオボタン
 */
const RadioBtn = (props: {
  title: string;
  name: string;
  value: any;
  typeList: Type[];
  onChange;
}) => {
  return (
    <Form.Group controlId={props.name}>
      {props.title ? <Form.Label>{props.title}</Form.Label> : null}
      <br />
      {props.typeList.map((i) => (
        <Form.Check
          type="radio"
          inline
          value={i.code}
          label={i.name}
          checked={i.code == props.value}
          onChange={props.onChange}
        />
      ))}
    </Form.Group>
  );
};

export default RadioBtn;
