import React from 'react';
import Flatpickr from 'react-flatpickr';

import { iconConst } from '../../../../constant/iconConstant';
import flatpickrLocale from '../../../locale/flatpickr.locale';
import Icon from '../icon/Icon';

type DayPickrProps = {
  /** 日付 */
  value: Date;
  /** 値が変更されたときのハンドラ関数 */
  onChange: (date: Date) => void;
};

/**
 *
 * @returns 日を選択できるinputボックス
 */
const DayPickr: React.FC<DayPickrProps> = ({ value, onChange }) => {
  return (
    <>
      <Icon icon={iconConst.bootstrap.BI_CALENDAR} />
      <Flatpickr
        className="bg-white border border-gray-300 block w-full p-2.5 shadow"
        options={{
          locale: flatpickrLocale,
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
