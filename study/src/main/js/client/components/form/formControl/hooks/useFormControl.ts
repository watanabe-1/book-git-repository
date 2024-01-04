import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import isEqual from 'react-fast-compare';

import { TextColor } from '../../../../../@types/studyBootstrap';
import { commonConst } from '../../../../../constant/commonConstant';
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
  initialValue,
  textValue,
  onChange,
  onBlur,
  onTextClick,
  onEditing,
  onClick,
  touched,
  error,
  dirty,
  isOnClickEditable,
  isReadonly,
  isNotSetValue,
  children,
}: FormControlProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isEditable, setIsEditable] = useState(
    !isReadonly && !isOnClickEditable
  );
  const [isInitialByOnEditable, setIsInitialByOnEditable] =
    useState(isEditable);
  const elementRefs: FormControlChildrenRefs = useRef<{
    [key in string]: unknown;
  }>({});
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const handleSetIsEditable = useCallback(
    (newEditingState: boolean) => {
      setIsEditable(newEditingState);
      // 初めて編集可能になったときのみ
      if (!isInitialByOnEditable && newEditingState) {
        setIsInitialByOnEditable(true);
      }
    },
    [isInitialByOnEditable]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<FormControlHTMLElement>) => {
      setCurrentValue(event.target.value);
      onChange?.(event);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    // handleFocus関数が猶予時間内に呼ばれた場合
    // (猶予時間内にchildrenからchildrenに
    // フォーカスが移った時)
    // は設定されているイベントを破棄
    if (isOnClickEditable) {
      clearTimeout(blurTimeoutRef.current);
    }
    //console.log('call handleFocus');
  }, [isOnClickEditable, blurTimeoutRef]);

  const handleBlur = useCallback(
    (event: React.FocusEvent<FormControlHTMLElement, Element>) => {
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
          handleSetIsEditable(false);
        }, commonConst.BLUR_FORMELEMENT_TIMEOUT_DURATION);
      }
      onBlur?.(event);
    },
    [isOnClickEditable, blurTimeoutRef, handleSetIsEditable, onBlur]
  );

  const handleTextClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      //console.log('call handleTextClick');
      if (!isEditable && isOnClickEditable && !isReadonly) {
        handleSetIsEditable(isOnClickEditable);
      }
      onTextClick?.(event);
    },
    [
      isEditable,
      isOnClickEditable,
      isReadonly,
      handleSetIsEditable,
      onTextClick,
    ]
  );

  const handleChildClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      //console.log('call handleChildClick');
      onClick?.(event, elementRefs);
    },
    [onClick]
  );

  useEffect(() => {
    if (isEditable && isOnClickEditable) {
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
  }, [isEditable]);

  // 初期値から変更されたか判定
  // 配列が比較対象になることがあるため、react-fast-compareを使用して比較
  const hasChanges = !isEqual(value, initialValue) && dirty;
  // 入力されたデータが有効な形式かどうか(バリデーションに引っかかるとfalseそれ以外true)
  const isValid = touched && !error;
  // 入力されたデータが有効な形式でないかどうか(バリデーションに引っかかるとtrueそれ以外false)
  const isInvalid = !!error;
  // 絶対に編集可能な状態になっていない
  // まだ1度も編集可能な状態になっていない状態である (!isInitialByOnEditable)
  // 編集可能か読み取り専用である (isOnClickEditable || isReadonly)
  const isNeverEditable =
    !isInitialByOnEditable && (isOnClickEditable || isReadonly);
  // 速度改善のためtextのみレンダリングで問題ない状態はtrue それ以外はfalseの判定を行う
  // 絶対に編集可能な状態になっていない(isNeverEditable)
  // バリデーションエラーがない (!isInvalid)
  const isTextOnly = isNeverEditable && !isInvalid;
  const trimText = simpleTrim(textValue);
  const trimValue = simpleTrim(value?.toString());
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
    hidden: !isEditable,
    // hidden属性だけだとうまくいかないためstyleから直接非表示に
    style: { display: isEditable ? '' : 'none' },
  } as FormControlChildrenProps;

  if (!isArrayChildren && !isNotSetValue) {
    childrenProps.value = currentValue;
  }

  return {
    convertedChildList,
    childrenProps,
    simpleTextColor,
    simpleTextValue,
    isArrayChildren,
    isEditable,
    isTextOnly,
    handleTextClick,
  };
};
