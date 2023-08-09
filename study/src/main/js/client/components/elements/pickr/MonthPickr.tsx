import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';

import { iconConst } from '../../../../constant/iconConstant';
import { createDate } from '../../../../study/util/studyDateUtil';
import flatpickrLocale from '../../../locale/flatpickr.locale';
import Icon from '../icon/Icon';

type MonthPickrProps = {
  /** 年 */
  year: number;
  /** 月 */
  month: number;
  /** 値が変更されたときのハンドラ関数 */
  onChange: (date: Date) => void;
};

/**
 *
 * @returns 月を選択できるinputボックス
 */
const MonthPickr: React.FC<MonthPickrProps> = ({ year, month, onChange }) => {
  //console.log(value);
  const [flatpickrKey, setFlatpickrKey] = useState(0);
  const value = createDate(year, month);

  useEffect(() => {
    // valueの変更を監視し、変更されたらflatpickrを再作成する
    // monthSelectPluginを使用しているときのみ(プラグインを使用しない場合正常に動く)valueを変更しても選択した日付のフォーカスまで変更してくれなかったため(一回前のvalueの値が選択された日付のところに設定されてしまっていた。inputboxの日付はちゃんと設定したvalueになっていたのでmonthSelectPluginのおそらくバグ？)keyを変更することで強制的にコンポーネントを再作成させる（初期描画の場合、正しく選択日付をフォーカスしてくれるため）
    setFlatpickrKey((prevKey) => prevKey + 1);
    //console.log(`flatpickrKey:${flatpickrKey}`);
  }, [year, month]);

  return (
    <>
      <Icon icon={iconConst.bootstrap.BI_CALENDAR} />
      <Flatpickr
        key={`flatpickrKey-monthSelectPlugin-${flatpickrKey}`}
        options={{
          locale: flatpickrLocale,
          dateFormat: 'Y/m/d(D)',
          defaultDate: value,
          plugins: [
            monthSelectPlugin({
              shorthand: true, // デフォルトはfalse
              dateFormat: 'Y/m', // デフォルトは"F Y"
              altFormat: 'Y/m', // デフォルトは"F Y"
              theme: 'dark', // デフォルトは"light"
            }),
          ],
        }}
        style={{ width: '80px' }}
        value={value}
        onChange={([date]) => {
          onChange(date);
        }}
      />
    </>
  );
};

export default MonthPickr;
