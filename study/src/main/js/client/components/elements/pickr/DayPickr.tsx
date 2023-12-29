import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfMonth } from 'date-fns/startOfMonth';
import React, { forwardRef, useCallback, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';

import { iconConst } from '../../../../constant/iconConstant';
import {
  convertToFlatpickrFormat,
  parseDate,
} from '../../../../study/util/studyDateUtil';
import flatpickrLocale from '../../../locale/flatpickr.locale';
import Icon from '../icon/Icon';

type DayPickrProps = {
  /** 日付 */
  value: string;
  /** テキストボックスの名前 */
  name?: string;
  /** 日付フォーマット*/
  dateFormat: string;
  /** 選択可能範囲をvalueの月のみにするか */
  onlyValueMonth: boolean;
  /** 値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** クリックしたときの関数 */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** テキストボックスを非表示にするかどうか */
  hidden?: boolean;
};

type DatePickerCallBackRef = (fp: Flatpickr) => void;

/**
 *
 * @returns 日を選択できるinputボックス
 */
export const DayPickr = forwardRef<DatePickerCallBackRef, DayPickrProps>(
  (
    {
      value,
      name,
      onChange,
      onBlur,
      onClick,
      hidden,
      dateFormat: pdateFormat,
      onlyValueMonth,
    },
    ref
  ) => {
    const date = useMemo(() => parseDate(value, pdateFormat), [value]);
    const dateFormat = useMemo(
      () => convertToFlatpickrFormat(pdateFormat),
      [pdateFormat]
    );

    const buildEventObject = useCallback(
      (value: string) => {
        return {
          target: {
            type: 'text',
            name: name,
            value: value,
          },
        } as unknown;
      },
      [name]
    );

    const options = useMemo(
      () => ({
        locale: flatpickrLocale,
        dateFormat: dateFormat,
        defaultDate: value,
        ...(onlyValueMonth && {
          minDate: startOfMonth(date),
          maxDate: endOfMonth(date),
        }),
      }),
      [flatpickrLocale, dateFormat, value, onlyValueMonth, date]
    );

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
              onChange?.(event);
            }
          }}
          onClose={(_, dateStr) => {
            const event = buildEventObject(
              dateStr
            ) as React.FocusEvent<HTMLInputElement>;
            onBlur?.(event);
          }}
          ref={ref as unknown as DatePickerCallBackRef}
        />
        <a
          className="input-button"
          title="toggle"
          onClick={(event) => {
            onClick?.(event);
          }}
        >
          <Icon icon={iconConst.bootstrap.BI_CALENDAR} />
        </a>
      </div>
    );
  }
);

DayPickr.displayName = 'DayPickr';
