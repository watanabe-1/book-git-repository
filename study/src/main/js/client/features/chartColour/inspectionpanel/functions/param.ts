/**
 * chartData用param作成
 *
 * @returns
 */
export const buildChartParam = (qty: string) => {
  const params = {};
  if (qty) {
    params['qty'] = qty;
  }

  return params;
};
