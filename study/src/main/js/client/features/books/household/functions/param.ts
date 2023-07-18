import format from 'date-fns/format';

/**
 * getInfo用param作成
 *
 * @returns
 */
export const buildParam = (date?: Date | string) => {
  const params = {};
  if (date)
    params['date'] =
      typeof date === 'string' ? date : format(date, 'yyyy/MM/dd');

  return params;
};
