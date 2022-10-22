import React from 'react';
import Form from 'react-bootstrap/Form';
import { Flag } from '../../@types/studyUtilType';

/**
 *
 * @returns form内のチェックボックス
 */
const CheckBox = (props: {
  name: string;
  value: any;
  flag: Flag;
  onChange;
}) => {
  return (
    <Form.Group controlId={props.name}>
      <Form.Check
        type="checkbox"
        value={props.flag.value}
        label={props.flag.name}
        checked={props.flag.value == props.value}
        onChange={props.onChange}
      />
    </Form.Group>
  );
};

export default CheckBox;
