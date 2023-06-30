import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';

import SimpleText from './SimpleText';

type TextBoxProps = {
  title?: string;
  name: string;
  value: string | number | string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  hidden?: boolean;
  validate?: boolean;
  touched?: unknown;
  error?: unknown;
  dirty?: boolean;
  IsOnClickEditable?: boolean;
};

/**
 * @param title - テキストボックスのタイトル
 * @param name - テキストボックスの名前
 * @param value - テキストボックスの値
 * @param onChange - テキストボックスの値が変更されたときのハンドラ関数
 * @param onBlur - テキストボックスからフォーカスが外れた時のハンドラ関数
 * @param hidden - テキストボックスを非表示にするかどうか
 * @param validate - バリデーションを行うかどうかを示すフラグ
 * @param touched - バリデーションが実行されたかどうかを示すフラグ
 * @param error - エラーメッセージ
 * @param dirty - formが変更されたかどうか
 * @param IsOnClickEditable - 通常は文字のみでクリックしたときに入力できるようにする
 * @returns form内のテキストボックス
 */
const TextBox: React.FC<TextBoxProps> = ({
  title = null,
  name,
  value,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  IsOnClickEditable = false,
}) => {
  const [text, setText] = useState(value);
  const [initialValue, setInitialValue] = useState(value);
  const [isEditing, setIsEditing] = useState(!IsOnClickEditable);
  const [hasChanges, setHasChanges] = useState(false);
  const textBoxRef = useRef(null);

  const handleChange = (event) => {
    // valueが変更されたとき
    // 編集済み判定フラグを編集済みに
    setHasChanges(true);
    setText(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const handleBlur = (event) => {
    if (IsOnClickEditable) {
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
    setIsEditing(true);
  };

  useEffect(() => {
    // 編集可能になった場合にフォーカスが当たっているようにする
    if (isEditing && IsOnClickEditable) {
      textBoxRef.current.focus();
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

  // type を hiddenにするのはpropsでhiddenが指定されていたときのみ
  // isEditingを「typeをhiddenに変更する条件」には入れない(hiddenに変更するとforcusがずれるため)
  const type = hidden ? 'hidden' : 'text';
  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;
  const simpleTextColor = hasChanges ? 'text-warning' : 'text-black';

  return (
    <Form.Group controlId={name} hidden={hidden}>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Control
        type={type}
        name={name}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={isValid}
        isInvalid={isInvalid}
        ref={textBoxRef}
        hidden={!isEditing}
      />
      <SimpleText
        name={name}
        value={value}
        onClick={handleTextClick}
        hidden={isEditing}
        textColorClass={simpleTextColor}
      />
      {validate && <Form.Control.Feedback>OK!</Form.Control.Feedback>}
      {validate && (
        <Form.Control.Feedback type="invalid">
          {error as string}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default TextBox;
