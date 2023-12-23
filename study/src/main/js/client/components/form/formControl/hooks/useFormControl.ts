import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import isEqual from 'react-fast-compare';

import { TextColor } from '../../../../../@types/studyBootstrap';
import { simpleTrim } from '../../../../../study/util/studyStringUtil';
import {
  FormControlChildrenRefs,
  FormControlChildrenProps,
  FormControlHTMLElement,
  FormControlProps,
} from '../types/formControlProps';

export const useFormControl = ({
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
}: FormControlProps) => {
  const [text, setText] = useState(value);
  const [initialValue, setInitialValue] = useState(value);
  const [isEditing, setIsEditing] = useState(!isReadonly && !isOnClickEditable);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialByOnEditable, setIsInitialByOnEditable] = useState(false);
  const elementRefs: FormControlChildrenRefs = useRef<{
    [key in string]: unknown;
  }>({});
  const blurTimeoutRef = useRef(null);
  const isArrayChildren = Array.isArray(children);
  const childArray = isArrayChildren ? children : [children];

  /**
   * refCallbackFunction を持つ形に配列を整形
   * useMemo でメモ化しつつ、refCallbackFunction を配列要素の値として持たせることで
   * 関数の参照先が意図せず変更されることを防ぐ
   */
  const convertedChildList = useMemo(
    () =>
      childArray.map((child) => ({
        id: child.key,
        child: child,
        refCallbackFunction: (node: unknown | null) => {
          if (node !== null && elementRefs.current[child.key] === undefined) {
            // node が null でなく、かつ、ref が未登録の場合
            elementRefs.current[child.key] = node;
          } else {
            // node が null の場合は、対象の node を管理する必要がなくなるため削除
            delete elementRefs.current[child.key];
          }
        },
      })),
    [childArray]
  );

  const handleSetIsEditing = (value: boolean) => {
    setIsEditing(value);
    // 初めて編集可能になったときのみ
    if (value && !isInitialByOnEditable) {
      setIsInitialByOnEditable(true);
    }
  };

  const handleSetHasChanges = (value: boolean) => {
    setHasChanges(value);
    // 初めて対象が変更になったときのみ
    if (value && !isInitialByOnEditable) {
      setIsInitialByOnEditable(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<FormControlHTMLElement>) => {
    setText(event.target.value);
    onChange?.(event);
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
        handleSetIsEditing(false);
      }, 100);
    }
    onBlur?.(event);
  };

  const handleTextClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //console.log('call handleTextClick');
    if (!isEditing && isOnClickEditable && !isReadonly) {
      handleSetIsEditing(isOnClickEditable);
    }
    onTextClick?.(event);
  };

  const handleChildClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //console.log('call handleChildClick');
    onClick?.(event, elementRefs);
  };

  /**
   * 速度改善のため
   * isOnClickEditable==true
   * もしくはreedonly==trueの時は
   * 一度編集可能になるまで描画しない
   *
   * @param callBack レンダリング対象
   * @returns
   */
  const renderInitialByOnEditable = (callBack: () => ReactNode) =>
    !isInitialByOnEditable && (isOnClickEditable || isReadonly)
      ? null
      : callBack();

  useEffect(() => {
    // console.log(`name:${name}`);
    // console.log(`value:${JSON.stringify(value)}`);
    // console.log(`initialValue:${JSON.stringify(initialValue)}`);
    // console.log(`value !== initialValue:${value !== initialValue}`);
    // console.log(
    //   `!isEqual(value, initialValue):${!isEqual(value, initialValue)}`
    // );

    // 初期値から変更されたか判定
    // 配列が比較対象になることがあるため、react-fast-compareを使用して比較
    // 非同期実行(useEffectの実行)のタイミングによってはdirtyがfalseの時でも、initialValueの値がdirtyトリガーのuseEffectによって更新される前に比較を実行してしまうことがあるため、必ずdirtyがtrueの時のみhasChangeがtrueになるようにする
    handleSetHasChanges(!isEqual(value, initialValue) && dirty);
  }, [value]);

  useEffect(() => {
    if (isEditing && isOnClickEditable) {
      // 編集可能になった場合にフォーカスが当たっているようにする
      // console.log(elementRefs?.current);
      for (const key in elementRefs?.current) {
        const inputRef = elementRefs.current[key] as HTMLElement;
        if (inputRef?.focus) {
          inputRef.focus();
          //focusした段階でfor文を終了
          break;
        }
      }
      onEditing?.(elementRefs);
    }
  }, [isEditing]);

  useEffect(() => {
    // dirtyがtrue→falseに変更されたときは送信ボタンが押されたとき(dirtyがfalseの時)
    // console.log(`name:${name}`);
    // console.log(`value:${JSON.stringify(value)}`);
    // console.log(`dirty:${dirty}`);
    if (!dirty) {
      // 編集済み判定フラグをリセット
      handleSetHasChanges(false);
      // 初期値を更新
      setInitialValue(value);
    }
  }, [dirty]);

  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;
  const trimText = simpleTrim(textValue);
  const trimValue = simpleTrim(value.toString());
  const trimTextBase = trimText || trimValue;
  // 基本的には必ずTextValueには値が入る想定だが、ない場合も考慮して一応変換
  const simpleTextValue = trimTextBase || '値がありません';
  // valueがないときは薄く表示
  const textColorBase: TextColor = trimValue ? 'text-black' : 'text-black-50';
  const simpleTextColor: TextColor = hasChanges
    ? 'text-warning'
    : textColorBase;

  const childrenProps = {
    name,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onClick: handleChildClick,
    isValid,
    isInvalid,
    hidden: !isEditing,
    // hidden属性だけだとうまくいかないためstyleから直接非表示に
    style: { display: isEditing ? '' : 'none' },
  } as FormControlChildrenProps;

  if (!isArrayChildren) {
    childrenProps.value = text;
  }

  return {
    convertedChildList,
    simpleTextColor,
    simpleTextValue,
    isArrayChildren,
    childrenProps,
    isEditing,
    handleTextClick,
    handleChildClick,
    renderInitialByOnEditable,
  };
};
