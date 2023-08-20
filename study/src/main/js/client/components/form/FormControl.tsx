import React, {
  cloneElement,
  useState,
  useEffect,
  useRef,
  forwardRef,
  ReactNode,
} from 'react';
import Form from 'react-bootstrap/Form';

import { trim } from '../../../study/util/studyUtil';
import { useInitialUUID } from '../../hooks/useCommon';
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
  /** シンプルテキストをクリックしたときの動作 */
  onTextClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /** isOnClickEditable == true かつ isEditing → trueになったときに実行  */
  onEditing?: () => void;
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
const FormControl = forwardRef<React.ReactElement, FormControlProps>(
  (
    {
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
      hidden = false,
      validate = false,
      touched = false,
      error = '',
      dirty = false,
      isOnClickEditable = false,
      readonly = false,
      children,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.MutableRefObject<any>
  ) => {
    const [text, setText] = useState(value);
    const [initialValue, setInitialValue] = useState(value);
    const [isEditing, setIsEditing] = useState(!readonly && !isOnClickEditable);
    const [hasChanges, setHasChanges] = useState(false);
    const [isInitialByOnEditable, setIsInitialByOnEditable] = useState(false);
    const elementRef = useRef(null);
    const blurTimeoutRef = useRef(null);
    const uuid = useInitialUUID();

    // 呼び出し元でrefが設定されていない場合
    if (ref == null) {
      ref = elementRef;
    }

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
      // valueが変更されたとき
      // 編集済み判定フラグを編集済みに
      handleSetHasChanges(true);
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
          handleSetIsEditing(false);
        }, 100);
      }
      if (onBlur) {
        onBlur(event);
      }
      // 初期値から変更されたか判定
      const eventValue = event.target.value;
      const textValue = eventValue ? eventValue : text;
      // 数値と文字列は同じように扱いため==で比較
      if (textValue == initialValue) {
        handleSetHasChanges(false);
      } else {
        handleSetHasChanges(true);
      }
    };

    const handleTextClick = (e) => {
      //console.log('call handleTextClick');
      if (!isEditing && isOnClickEditable && !readonly) {
        handleSetIsEditing(isOnClickEditable);
      }
      if (onTextClick) {
        onTextClick(e);
      }
    };

    useEffect(() => {
      // readonlyの時は連携された値が変更されているかどうかで判定を行う
      if (readonly) {
        // 初期値から変更されたか判定
        // 数値と文字列は同じように扱いため==で比較
        if (value == initialValue) {
          handleSetHasChanges(false);
        } else {
          handleSetHasChanges(true);
        }
      }
    }, [value]);

    useEffect(() => {
      if (isEditing && isOnClickEditable) {
        // 編集可能になった場合にフォーカスが当たっているようにする
        if (ref?.current?.focus) {
          ref.current.focus();
        }

        if (onEditing) {
          onEditing();
        }
      }
    }, [isEditing]);

    useEffect(() => {
      // dirtyがtrue→falseに変更されたときは送信ボタンが押されたとき(dirtyがfalseの時)
      if (!dirty) {
        // 編集済み判定フラグをリセット
        handleSetHasChanges(false);
        // 初期値を更新
        setInitialValue(value);
      }
    }, [dirty]);

    const isArrayChildren = Array.isArray(children);
    const isValid = validate && touched && !error;
    const isInvalid = validate && !!error;
    const textBase = trim(textValue) ? textValue : value;
    const trimTextBase =
      typeof textBase === 'string' ? trim(textBase) : textBase;
    const simpleTextValue = trimTextBase ? trimTextBase : '値がありません';
    const textColorBase = trimTextBase ? 'text-black' : 'text-black-50';
    const simpleTextColor = hasChanges ? 'text-warning' : textColorBase;

    const childrenProps = {
      name,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      isValid,
      isInvalid,
      hidden: !isEditing,
      ref: ref,
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
          isArrayChildren
            ? children.map((child, index) =>
                cloneElement(child, {
                  key: index,
                  // hidden属性だけだとうまくいかないためstyleから直接非表示に
                  style: { display: isEditing ? '' : 'none' },
                  ...childrenProps,
                })
              )
            : cloneElement(children, {
                value: text,
                ...childrenProps,
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
  }
);

FormControl.displayName = 'FormControl';

export default FormControl;
