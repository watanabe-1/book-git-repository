import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './formControl/FormControl';
import { Type } from '../../../@types/studyUtilType';
import { ToTypeArrayIfIsStringArray } from '../../../study/util/studyUtil';

type RadioBtnProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string;
  /** 初期値(valueとの比較用) */
  initialValue: string;
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
  touched?: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
  /** 読み取り専用にするか */
  isReadonly?: boolean;
};

/**
 * 選択肢の表示値を取得
 *
 * @param typeList 選択肢のリスト
 * @param code 取得したい選択肢のコード
 */
const getRadioBtnTextValue = (typeList: Type[], code) => {
  const textValue = typeList.find((type) => type.code === code)?.name;

  return textValue ? textValue : '値がありません';
};

/**
 * ラジオボタン詳細を取得
 *
 * @param baseList 選択肢のリスト
 * @param code 取得したい選択肢のコード
 * @returns
 */
export const getRadioBtnDetails = (baseList: Type[] | string[], code) => {
  const typeList = ToTypeArrayIfIsStringArray(baseList);
  const textValue = getRadioBtnTextValue(typeList, code);

  return {
    textValue,
    typeList,
  };
};

/**
 *
 * @returns form内のラジオボタン
 */
const RadioBtn: React.FC<RadioBtnProps> = ({
  title = null,
  name,
  value,
  initialValue,
  typeList: pTypeList,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  isReadonly = false,
}) => {
  const titleBr = !!title;
  const { typeList, textValue } = getRadioBtnDetails(pTypeList, value);

  return (
    <FormControl
      title={title}
      titleBr={titleBr}
      name={name}
      value={value || ''}
      initialValue={initialValue || ''}
      textValue={textValue || ''}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
      isReadonly={isReadonly}
    >
      {typeList.map((type, index) => {
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
