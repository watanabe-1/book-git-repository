import format from 'date-fns/format';

/**
 * getInfo用param作成
 *
 * @returns
 */
export const buildInfoParam = (date: Date | string, dateFormat: string) => {
  const params = {};
  if (date) {
    params['date'] = typeof date === 'string' ? date : format(date, dateFormat);
    params['dateFormat'] = dateFormat;
  }

  return params;
};

/**
 * getHouseHoldData用param作成
 *
 * @returns
 */
export const buildChartParam = (
  date: Date | string,
  dateFormat: string,
  validateKey: number
) => {
  const params = buildInfoParam(date, dateFormat);
  // サーバー側で受け取るパラメータではなく
  // 再度fetchを行うかの判定用のために使用
  // 他のタブでデータが更新されたときにこのキーもカウントアップされる想定
  params['validateKey'] = validateKey;

  return params;
};

/**
 * getHouseHoldData用param作成
 *
 * @returns
 */
export const buildDataParam = (
  date: Date | string,
  dateFormat: string,
  booksType: string
) => {
  const params = buildInfoParam(date, dateFormat);
  params['booksType'] = booksType;

  return params;
};
