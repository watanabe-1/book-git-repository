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
  children,
}) => {
  const {
    convertedChildList,
    childrenProps,
    isArrayChildren,
    isEditing,
    simpleTextColor,
    simpleTextValue,
    handleTextClick,
    renderInitialByOnEditable,
  } = useFormControl({
    name,
    value,
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
      {renderInitialByOnEditable(() =>
        convertedChildList.map(({ id, child, refCallbackFunction }) => {
          return cloneElement(child, {
            ...childrenProps,
            key: id,
            ref: refCallbackFunction,
          });
        })
      )}
      {!isEditing && (
        <SimpleText
          name={name}
          value={simpleTextValue}
          hidden={isEditing}
          textColorClass={simpleTextColor}
          textMaxLength={textMaxLength}
          onClick={handleTextClick}
        />
      )}
      {renderInitialByOnEditable(
        () =>
          validate && (
            <Form.Control.Feedback onClick={handleTextClick}>
              OK!
            </Form.Control.Feedback>
          )
      )}
      {renderInitialByOnEditable(
        () =>
          validate && (
            <Form.Control.Feedback type="invalid" onClick={handleTextClick}>
              {error as string}
            </Form.Control.Feedback>
          )
      )}
    </Form.Group>
  );
};

export default FormControl;
