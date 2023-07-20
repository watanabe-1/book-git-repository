import React, { cloneElement, useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';

import SimpleText from '../elements/text/SimpleText';

type FormControlProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** ラベルの後にbrタグを入れるかどうか */
  titleBr?: boolean;
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
  /** 読み取り専用にするか */
  readonly?: boolean;
  /** 子コンポーネント react bootstrap form elementを想定 */
  children: React.ReactElement | React.ReactElement[];
};

type FormControlHTMLElement = HTMLInputElement | HTMLSelectElement;

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
  textMaxLength = 15,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  readonly = false,
  children,
}) => {
  const [text, setText] = useState(value);
  const [initialValue, setInitialValue] = useState(value);
  const [isEditing, setIsEditing] = useState(!readonly && !isOnClickEditable);
  const [hasChanges, setHasChanges] = useState(false);
  const formElementRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  const handleChange = (event: React.ChangeEvent<FormControlHTMLElement>) => {
    // valueが変更されたとき
    // 編集済み判定フラグを編集済みに
    setHasChanges(true);
    setText(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const handleFocus = () => {
    // handleFocus関数が猶予時間内に呼ばれた場合
    // (猶予時間内にchildrenからchildrenに
    // フォーカスが移った時)
    // は設定されているイベントを破棄
    if (isOnClickEditable) {
      clearTimeout(blurTimeoutRef.current);
    }
    //console.log('call handleFocus');
  };

  const handleBlur = (
    event: React.FocusEvent<FormControlHTMLElement, Element>
  ) => {
    if (isOnClickEditable) {
      // razioボタンのようなchildrenが複数存在
      // するときに、childrenからchildrenに
      // フォーカスを移したとき
      // (片側のchildrenにフォーカスが当たっている
      // ときに、もう片側のchildrenにフォーカスを
      // クリックなどで移したとき)
      // はisEditing→falseにしたくないため
      // 猶予時間を設ける
      // handleFocus関数が猶予時間内に呼ばれた場合
      // (猶予時間内にchildrenからchildrenに
      // フォーカスが移った時)
      // はisEditing→falseに更新しない
      blurTimeoutRef.current = setTimeout(() => {
        //console.log('call blurTimeoutRef.current');
        setIsEditing(false);
      }, 100);
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
    if (!isEditing && isOnClickEditable && !readonly) {
      setIsEditing(isOnClickEditable);
    }
  };

  useEffect(() => {
    // readonlyの時は連携された値が変更されているかどうかで判定を行う
    if (readonly) {
      // 初期値から変更されたか判定
      if (value === initialValue) {
        setHasChanges(false);
      } else {
        setHasChanges(true);
      }
    }
  }, [value]);

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

  const isArrayChildren = Array.isArray(children);
  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;
  const textBase = textValue ? textValue : value;
  const simpleTextValue = textBase ? textBase : '値がありません';
  const textColorBase = textBase ? 'text-black' : 'text-black-50';
  const simpleTextColor = hasChanges ? 'text-warning' : textColorBase;

  const childrenProps = {
    name,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    isValid,
    isInvalid,
    ref: formElementRef,
  };

  return (
    <Form.Group controlId={name} hidden={hidden}>
      {title &&
        (isArrayChildren ? (
          <span> {title}</span>
        ) : (
          <Form.Label onClick={handleTextClick}>{title}</Form.Label>
        ))}
      {titleBr && <br />}
      {isArrayChildren
        ? children.map((child, index) =>
            cloneElement(child, {
              key: index,
              // hidden属性だとうまくいかないためstyleから直接非表示に
              style: { display: isEditing ? '' : 'none' },
              ...childrenProps,
            })
          )
        : cloneElement(children, {
            value: text,
            hidden: !isEditing,
            ...childrenProps,
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