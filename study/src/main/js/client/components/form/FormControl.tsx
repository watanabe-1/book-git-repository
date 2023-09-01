import React, {
  cloneElement,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
} from 'react';
import Form from 'react-bootstrap/Form';

import { trim } from '../../../study/util/studyUtil';
import { useInitialUUID } from '../../hooks/useCommon';
import SimpleText from '../elements/text/SimpleText';

export type ChildrenRefs = React.MutableRefObject<{
  [x: string]: unknown;
}>;

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
  readonly = false,
  children,
}) => {
  const [text, setText] = useState(value);
  const [initialValue, setInitialValue] = useState(value);
  const [isEditing, setIsEditing] = useState(!readonly && !isOnClickEditable);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialByOnEditable, setIsInitialByOnEditable] = useState(false);
  const elementRefs: ChildrenRefs = useRef<{
    [key in string]: unknown;
  }>({});
  const blurTimeoutRef = useRef(null);
  const uuid = useInitialUUID();
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

  const handleTextClick = (e) => {
    //console.log('call handleTextClick');
    if (!isEditing && isOnClickEditable && !readonly) {
      handleSetIsEditing(isOnClickEditable);
    }
    onTextClick?.(e);
  };

  const handleChildClick = (e) => {
    //console.log('call handleChildClick');
    onClick?.(e, elementRefs);
  };

  useEffect(() => {
    // 初期値から変更されたか判定
    // console.log(`value:${value}`);
    // console.log(`initialValue:${initialValue}`);
    handleSetHasChanges(value !== initialValue);
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
    //console.log(dirty);
    if (!dirty) {
      // 編集済み判定フラグをリセット
      handleSetHasChanges(false);
      // 初期値を更新
      setInitialValue(value);
    }
  }, [dirty]);

  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;
  const textBase = textValue || value;
  const trimTextBase = trim(textBase.toString());
  const simpleTextValue = trimTextBase || '値がありません';
  const textColorBase = trimTextBase ? 'text-black' : 'text-black-50';
  const simpleTextColor = hasChanges ? 'text-warning' : textColorBase;

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
  };

  if (!isArrayChildren) {
    childrenProps['value'] = text;
  }

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
    !isInitialByOnEditable && (isOnClickEditable || readonly)
      ? null
      : callBack();

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
