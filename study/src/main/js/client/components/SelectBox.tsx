import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';

import { Type } from '../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../study/util/studyUtil';
import SimpleText from './SimpleText';

type SelectBoxProps = {
  title?: string;
  name: string;
  value: string;
  typeList: Type[] | string[];
  isUnshiftEmpty?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
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
 * @param typeList - 選択しのリスト
 * @param isUnshiftEmpty - 選択しの先頭に空の選択しを追加するか
 * @param onChange - テキストボックスの値が変更されたときのハンドラ関数
 * @param onBlur - テキストボックスからフォーカスが外れた時のハンドラ関数
 * @param hidden - テキストボックスを非表示にするかどうか
 * @param validate - バリデーションを行うかどうかを示すフラグ
 * @param touched - バリデーションが実行されたかどうかを示すフラグ
 * @param error - エラーメッセージ
 * @param dirty - formが変更されたかどうか
 * @param IsOnClickEditable - 通常は文字のみでクリックしたときに入力できるようにする
 * @returns form内のセレクトボックス(バリデーションあり)
 */
const SelectBox: React.FC<SelectBoxProps> = ({
  title = null,
  name,
  value,
  typeList,
  isUnshiftEmpty = false,
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
  const selectBoxRef = useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // valueが変更されたとき
    // 編集済み判定フラグを編集済みに
    setHasChanges(true);
    setText(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLSelectElement, Element>) => {
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
      selectBoxRef.current.focus();
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
  const simpleTextColor = hasChanges ? 'text-warning' : 'text-black';

  const newTypeList = ToTypeArrayIfIsStringArray(typeList);
  //先頭に空要素を追加
  if (isUnshiftEmpty) {
    newTypeList.unshift({
      code: '',
      name: '選択してください',
    });
  }
  const selectedType = newTypeList.find((type) => type.code == text);

  return (
    <Form.Group controlId={name} hidden={hidden}>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Select
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={isValid}
        isInvalid={isInvalid}
        ref={selectBoxRef}
        hidden={!isEditing}
      >
        {newTypeList.map((type, i) => (
          <option
            key={`${type.code}-${i}`}
            selected={type.code == text}
            value={type.code}
          >
            {type.name}
          </option>
        ))}
      </Form.Select>
      <SimpleText
        name={name}
        value={selectedType ? selectedType.name : ''}
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

export default SelectBox;
