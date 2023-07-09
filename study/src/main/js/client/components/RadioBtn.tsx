import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './FormControl';
import { Type } from '../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../study/util/studyUtil';

type RadioBtnProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string;
  /** 選択肢のリスト */
  typeList: Type[] | string[];
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
};

/**
 *
 * @returns form内のラジオボタン
 */
const RadioBtn: React.FC<RadioBtnProps> = ({
  title = null,
  name,
  value,
  typeList,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
}) => {
  const newTypeList = ToTypeArrayIfIsStringArray(typeList);
  const selectedType = newTypeList.find((type) => type.code === value);
  const titleBr = !!title;

  return (
    <FormControl
      title={title}
      titleBr={titleBr}
      name={name}
      value={value}
      textValue={selectedType ? selectedType.name : ''}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
    >
      {newTypeList.map((type, index) => {
        const id = `${name}-${index}`;

        return (
          <Form.Check
            key={id}
            type="radio"
            inline
            name={name}
            id={id}
            value={type.code}
            label={type.name}
            checked={type.code === value}
          />
        );
      })}
    </FormControl>
  );
};

export default RadioBtn;
