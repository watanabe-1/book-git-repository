import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';

import SimpleText from './SimpleText';

type FormControlProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string | number | string[];
  /** テキストとして表示する値 */
  textValue?: string;
  /** テキストの最大桁数 */
  textMaxLength?: number;
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<FormControlHTMLElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<FormControlHTMLElement>) => void;
  /** テキストボックスを非表示にするかどうか */
  hidden?: boolean;
  /** バリデーションを行うかどうかを示すフラグ */
  validate?: boolean;
  /** バリデーションが実行されたかどうかを示すフラグ */
  touched?: unknown;
  /** エラーメッセージ */
  error?: unknown;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
  /** 子コンポーネント */
  children: React.ReactElement;
};

type FormControlHTMLElement = HTMLInputElement | HTMLSelectElement;

/**
 *
 * @returns form内のテキストボックス
 */
const FormControl: React.FC<FormControlProps> = ({
  title = null,
  name,
  value,
  textValue = null,
  textMaxLength = null,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  children,
}) => {
  const [text, setText] = useState(value);
  const [initialValue, setInitialValue] = useState(value);
  const [isEditing, setIsEditing] = useState(!isOnClickEditable);
  const [hasChanges, setHasChanges] = useState(false);
  const formElementRef = useRef(null);

  const handleChange = (event: React.ChangeEvent<FormControlHTMLElement>) => {
    // valueが変更されたとき
    // 編集済み判定フラグを編集済みに
    setHasChanges(true);
    setText(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const handleBlur = (
    event: React.FocusEvent<FormControlHTMLElement, Element>
  ) => {
    if (isOnClickEditable) {
      setIsEditing(false);
    }
    if (onBlur) {
      onBlur(event);
    }
    // 初期値から変更されたか判定
    if (text === initialValue) {
      setHasChanges(false);
    } else {
      setHasChanges(true);
    }
  };

  const handleTextClick = () => {
    //console.log('call handleTextClick');
    if (!isEditing && isOnClickEditable) {
      setIsEditing(isOnClickEditable);
    }
  };

  useEffect(() => {
    // 編集可能になった場合にフォーカスが当たっているようにする
    if (isEditing && isOnClickEditable) {
      formElementRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // dirtyがtrue→falseに変更されたときは送信ボタンが押されたとき(dirtyがfalseの時)
    if (!dirty) {
      // 編集済み判定フラグをリセット
      setHasChanges(false);
      // 初期値を更新
      setInitialValue(value);
    }
  }, [dirty]);

  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;
  const textBase = textValue ? textValue : value;
  const simpleTextValue = textBase ? textBase : '値がありません';
  const textColorBase = textBase ? 'text-black' : 'text-black-50';
  const simpleTextColor = hasChanges ? 'text-warning' : textColorBase;

  return (
    <Form.Group controlId={name} hidden={hidden}>
      {title && <Form.Label onClick={handleTextClick}>{title}</Form.Label>}
      {React.cloneElement(children, {
        name,
        value: text,
        onChange: handleChange,
        onBlur: handleBlur,
        isValid,
        isInvalid,
        ref: formElementRef,
        hidden: !isEditing,
      })}
      <SimpleText
        name={name}
        value={simpleTextValue}
        hidden={isEditing}
        textColorClass={simpleTextColor}
        textMaxLength={textMaxLength}
        onClick={handleTextClick}
      />
      {validate && (
        <Form.Control.Feedback onClick={handleTextClick}>
          OK!
        </Form.Control.Feedback>
      )}
      {validate && (
        <Form.Control.Feedback type="invalid" onClick={handleTextClick}>
          {error as string}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormControl;
