import React from 'react';
import React from 'react';

import { ChildrenRefs } from './formControlProps';
import { FormControlHTMLElement } from './formControlProps';

export type FormControlProps = {
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
  /** シンプルテキストをクリックしたときの動作 */
  onTextClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * isOnClickEditable === true
   * かつ isEditing → trueになったときに実行
   *
   * @param elementRefs childrenの参照を詰めたオブジェクト elementRefs.current[childenのkeyで取得可能]
   * @returns
   */
  onEditing?: (elementRefs: ChildrenRefs) => void;
  /**
   * childをclickしたときに発生
   *
   * @param event clickイベント
   * @param elementRefs childrenの参照を詰めたオブジェクト elementRefs.current[childenのkeyで取得可能]
   * @returns
   */
  onClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    elementRefs: ChildrenRefs
  ) => void;
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
  isReadonly?: boolean;
  /** 子コンポーネント react bootstrap form elementを想定 */
  children: React.ReactElement | React.ReactElement[];
};

export type ChildrenRefs = React.MutableRefObject<{
  [x: string]: unknown;
}>;

export type FormControlHTMLElement = HTMLInputElement | HTMLSelectElement;
