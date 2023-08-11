import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { FormikErrors } from 'formik';
import React, { forwardRef, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Flatpickr from 'react-flatpickr';
import DatePicker from 'react-flatpickr';

import FormControl from './FormControl';
import { iconConst } from '../../../constant/iconConstant';
import {
  convertToFlatpickrFormat,
  parseDate,
} from '../../../study/util/studyDateUtil';
import flatpickrLocale from '../../locale/flatpickr.locale';
import Icon from '../elements/icon/Icon';

type DayPickrBoxProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string;
  /** 選択日付保存先名称 */
  fieldNameByNames: string;
  /** formikvalue保存用関数 */
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<unknown>>;
  /** 日付フォーマット*/
  dateFormat: string;
  /** 選択可能範囲をvalueの月のみにするか */
  onlyValueMonth?: boolean;
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
};

type DayPickrProps = {
  /** 日付 */
  value: string;
  /** 日付フォーマット*/
  dateFormat: string;
  /** 選択可能範囲をvalueの月のみにするか */
  onlyValueMonth: boolean;
  /** 値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** テキストボックスを非表示にするかどうか */
  hidden?: boolean;
};

const openFp = (fp: React.MutableRefObject<DatePicker>) => {
  if (!fp?.current?.flatpickr) return;
  // カレンダーの表示基準元が存在しない場合、
  // カレンダーの表示位置がバグってしまうため、
  // カレンダーの表示元が描画された後に動くよう
  // に少し実施を遅らせる
  setTimeout(() => {
    fp.current.flatpickr.open();
  }, 100);
};

/**
 * @returns form内のテキストボックス
 */
const DayPickrBox: React.FC<DayPickrBoxProps> = ({
  title = null,
  name,
  value: pvalue,
  dateFormat,
  fieldNameByNames,
  setFieldValue,
  onlyValueMonth = false,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
  readonly = false,
}) => {
  const fp = useRef(null);
  const value = pvalue ? pvalue : '';

  const handleSet = (e) => {
    setFieldValue(fieldNameByNames, e.target.value);
  };

  return (
    <div>
      <FormControl
        title={title}
        name={name}
        value={value}
        onBlur={handleSet}
        onTextClick={() => {
          if (!readonly) {
            openFp(fp);
          }
        }}
        hidden={hidden}
        validate={validate}
        touched={touched}
        error={error}
        dirty={dirty}
        isOnClickEditable={isOnClickEditable}
        readonly={readonly}
        ref={fp}
      >
        {/*エラーチェック結果を表示するため  Form.Controlを使用
        エラーチェック結果のみ表示されればよいのでhidden固定*/}
        <Form.Control type="hidden" />
        <DayPickr
          value={value}
          dateFormat={dateFormat}
          onlyValueMonth={onlyValueMonth}
        />
      </FormControl>
    </div>
  );
};

/**
 *
 * @returns 日を選択できるinputボックス
 */
const DayPickr = forwardRef<DatePicker, DayPickrProps>(
  (
    {
      value,
      onChange,
      onBlur,
      hidden,
      dateFormat: pdateFormat,
      onlyValueMonth,
    },
    ref
  ) => {
    const date = parseDate(value, pdateFormat);
    const dateFormat = convertToFlatpickrFormat(pdateFormat);

    const buildEventObject = (value: string) => {
      return {
        target: {
          value: value,
        },
      } as unknown;
    };

    const options: Partial<BaseOptions> = {
      locale: flatpickrLocale,
      dateFormat: dateFormat,
      defaultDate: value,
    };
    if (onlyValueMonth) {
      options.minDate = startOfMonth(date);
      options.maxDate = endOfMonth(date);
    }
    return (
      <div className="flatpickr" hidden={hidden}>
        <Flatpickr
          className="bg-white border border-gray-300 block w-full p-2.5 shadow"
          options={options}
          style={{ width: '120px' }}
          value={value}
          onValueUpdate={(_, dateStr) => {
            if (dateStr !== value) {
              const event = buildEventObject(
                dateStr
              ) as React.ChangeEvent<HTMLInputElement>;

              if (onChange) {
                onChange(event);
              }
            }
          }}
          onClose={(_, dateStr) => {
            const event = buildEventObject(
              dateStr
            ) as React.FocusEvent<HTMLInputElement>;

            if (onBlur) {
              onBlur(event);
            }
          }}
          ref={ref}
        />
        <a
          className="input-button"
          title="toggle"
          onClick={() => {
            openFp(ref as React.MutableRefObject<DatePicker>);
          }}
        >
          <Icon icon={iconConst.bootstrap.BI_CALENDAR} />
        </a>
      </div>
    );
  }
);

DayPickr.displayName = 'DayPickr';

export default DayPickrBox;
