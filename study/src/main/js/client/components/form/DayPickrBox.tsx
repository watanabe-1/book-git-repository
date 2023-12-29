import React, { useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-flatpickr';

import FormControl from './formControl/FormControl';
import { FormControlChildrenRefs } from './formControl/types/formControlProps';
import { DayPickr } from '../elements/pickr/DayPickr';

type DayPickrBoxProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string;
  /** 初期値(valueとの比較用) */
  initialValue: string;
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** 日付フォーマット*/
  dateFormat: string;
  /** 選択可能範囲をvalueの月のみにするか */
  onlyValueMonth?: boolean;
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
 * @returns form内のテキストボックス
 */
const DayPickrBox: React.FC<DayPickrBoxProps> = ({
  title = null,
  name,
  value: pvalue,
  initialValue,
  dateFormat,
  onChange,
  onBlur,
  onlyValueMonth = false,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  isReadonly = false,
}) => {
  const DAY_PICKR_KEY = 'dayPickr';
  const value = pvalue || '';

  const openFp = useCallback(
    (refs: FormControlChildrenRefs) => {
      if (isReadonly) return;

      const fp = refs?.current[DAY_PICKR_KEY] as DatePicker;
      //console.log(fp);

      if (!fp?.flatpickr) return;
      // カレンダーの表示基準元が存在しない場合、
      // カレンダーの表示位置がバグってしまうため、
      // カレンダーの表示元が描画された後に動くよう
      // に少し実施を遅らせる
      setTimeout(() => {
        fp.flatpickr?.open();
      }, 100);
    },
    [isReadonly]
  );

  return (
    <div>
      <FormControl
        title={title}
        name={name}
        value={value}
        initialValue={initialValue}
        onChange={onChange}
        onBlur={onBlur}
        onEditing={openFp}
        onClick={(_, refs) => {
          openFp(refs);
        }}
        hidden={hidden}
        validate={validate}
        touched={touched}
        error={error}
        dirty={dirty}
        isOnClickEditable={isOnClickEditable}
        isReadonly={isReadonly}
      >
        {/*エラーチェック結果を表示するため  Form.Controlを使用
        エラーチェック結果のみ表示されればよいのでhidden固定*/}
        <Form.Control type="hidden" key="dayPickerFormControl" />
        <DayPickr
          value={value}
          dateFormat={dateFormat}
          onlyValueMonth={onlyValueMonth}
          key={DAY_PICKR_KEY}
        />
      </FormControl>
    </div>
  );
};

export default DayPickrBox;
