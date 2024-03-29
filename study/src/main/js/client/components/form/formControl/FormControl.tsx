import React, { cloneElement } from 'react';
import Form from 'react-bootstrap/Form';

import { useFormControl } from './hooks/useFormControl';
import { FormControlProps } from './types/formControlProps';
import { useInitialUUID } from '../../../hooks/useCommon';
import SimpleText from '../../elements/text/SimpleText';

/**
 *
 * @returns form内のテキストボックス
 */
const FormControl: React.FC<FormControlProps> = ({
  title = null,
  titleBr = false,
  name,
  value,
  initialValue,
  textValue = null,
  textMaxLength = 30,
  onChange,
  onBlur,
  onTextClick,
  onEditing,
  onClick,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  isReadonly = false,
  isNotSetValue = false,
  children,
}) => {
  const {
    convertedChildList,
    childrenProps,
    simpleTextColor,
    simpleTextValue,
    isArrayChildren,
    isEditable,
    isTextOnly,
    handleTextClick,
  } = useFormControl({
    name,
    value,
    initialValue,
    textValue,
    onChange,
    onBlur,
    onTextClick,
    onEditing,
    onClick,
    validate,
    touched,
    error,
    dirty,
    isOnClickEditable,
    isReadonly,
    children,
    isNotSetValue,
  });
  const uuid = useInitialUUID();

  return (
    <Form.Group controlId={uuid} hidden={hidden}>
      {title &&
        (isArrayChildren ? (
          <span> {title}</span>
        ) : (
          <Form.Label onClick={handleTextClick}>{title}</Form.Label>
        ))}
      {titleBr && <br />}
      {!isTextOnly &&
        convertedChildList.map(({ id, child, refCallbackFunction }) => {
          return cloneElement(child, {
            ...childrenProps,
            key: id,
            ref: refCallbackFunction,
          });
        })}
      {!isEditable && (
        <SimpleText
          name={name}
          value={simpleTextValue}
          hidden={isEditable}
          textColorClass={simpleTextColor}
          textMaxLength={textMaxLength}
          onClick={handleTextClick}
        />
      )}
      {!isTextOnly && validate && (
        <Form.Control.Feedback onClick={handleTextClick}>
          OK!
        </Form.Control.Feedback>
      )}
      {!isTextOnly && validate && (
        <Form.Control.Feedback type="invalid" onClick={handleTextClick}>
          {error as string}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormControl;
