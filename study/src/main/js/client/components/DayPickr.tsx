import { CustomLocale } from 'flatpickr/dist/types/locale';
import React from 'react';
import Flatpickr from 'react-flatpickr';

import Icon from './Icon';
import { iconConst } from '../../constant/iconConstant';

type DayPickrProps = {
  /** 日付 */
  value: Date;
  /** ロケール */
  locale: CustomLocale;
  /** 値が変更されたときのハンドラ関数 */
  onChange: (date: Date) => void;
};

/**
 *
 * @returns 日を選択できるinputボックス
 */
const DayPickr: React.FC<DayPickrProps> = ({ value, locale, onChange }) => {
  return (
    <>
      <Icon icon={iconConst.bootstrap.BI_CALENDAR} />
      <Flatpickr
        className="bg-white border border-gray-300 block w-full p-2.5 shadow;"
        options={{
          locale: locale,
          dateFormat: 'Y/m/d(D)',
          defaultDate: value,
        }}
        style={{ width: '120px' }}
        value={value}
        onChange={([date]) => {
          onChange(date);
        }}
      />
    </>
  );
};

export default DayPickr;
