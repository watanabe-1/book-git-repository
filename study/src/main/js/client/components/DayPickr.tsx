import { CustomLocale } from 'flatpickr/dist/types/locale';
import React from 'react';
import Flatpickr from 'react-flatpickr';

import { iconConstant } from '../../constant/iconConstant';
import Icon from './Icon';

/**
 *
 * @returns 日を選択できるinputボックス
 */
const DayPickr = ({
  value,
  locale,
  onChange,
}: {
  value: Date;
  locale: CustomLocale;
  onChange: (date: Date) => void;
}) => {
  return (
    <>
      <Icon icon={iconConstant.bootStrap.BI_CALENDAR} />
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
