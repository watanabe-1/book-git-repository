import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DoughnutChart from '../../../components/DoughnutChart';
import { executeFuncIfNeeded, onServer } from '../../../on-server';
import { ChartData } from 'chart.js';
import { fetchGet, isObjEmpty } from '../../../../study/util/studyUtil';
import { UrlConst } from '../../../../constant/urlConstant';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import { isInvalidDate } from '../../../../study/util/studyDateUtil';
import BarChart from '../../../components/BarChart';
import BarAndLineChart from '../../../components/BarAndLineChart';

/**
 * 家計簿図用データ
 */
export type HouseholdChartData = {
  monthCategory: ChartData<'doughnut'> | ChartData<'bar'>;
  monthMethod: ChartData<'doughnut'> | ChartData<'bar'>;
  yearAll: ChartData<'bar'>;
};

const Chart = ({ year, month }: { year: number; month: number }) => {
  const [initiaChartData, initScript] = onServer(
    (api, param) => api.getHouseholdChartInfo(param),
    [],
    'books.householdchartInfo'
  ) as [HouseholdChartData, JSX.Element];
  const [chartData, setChartData] = useState(initiaChartData);
  const { monthCategory, monthMethod, yearAll } = chartData;
  const date = new Date(year, month - 1);

  console.log('chartdata');
  console.log(chartData);

  // 日付けが正しく設定されるまで
  if (isInvalidDate(date)) return <BodysLodingSpinner />;

  /**
   * 1月ごとのカテゴリーチャート用データ取得
   */
  const fetchInfo = async () => {
    const params = {};
    if (date) params['date'] = date;
    const response = await fetchGet(
      UrlConst.Books.HOUSEHOLD_CHART_INFO,
      params
    );
    const data = (await response.json()) as HouseholdChartData;
    setChartData(data);
  };

  // 親がサーバーから受け取るmonthの値に変化がある(値に変化がるというよりは参照先に変更があった場合)再レンダリングする
  // Dateを直接親から受け取らないようにしているのは親ファイル内でDateはレンダリング時に毎回「new」で作り直しているため、値が同じ(同じ日時)のデータの場合でも参照先が毎回変わってしまい、そのたびにuseEffectが動いてしまうため
  // 例 : タブを切り替えるたびに親の再レンダリングが動くが、その時は日付けは変わっていない しかし親から渡された日付けをそのままuseEffectの条件(第二引数)にした場合、親側ではレンダリングのたびに「new」で作り直しているため参照先が変わり毎回useEffectが実行される
  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(fetchInfo);
  }, [month]);

  return (
    <>
      <Container>
        <Row>
          <Col sm="12">
            {!isObjEmpty(yearAll) && (
              <BarAndLineChart
                data={yearAll}
                date={date}
                topTitle="過去12ヶ月"
              />
            )}
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <h1 className="h4">以下 支出のみ</h1>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col sm="6">
            {!isObjEmpty(monthCategory) && (
              <DoughnutChart
                data={monthCategory as ChartData<'doughnut'>}
                date={date}
                middleTitle="カテゴリー別"
              />
            )}
          </Col>
          <Col sm="6">
            {!isObjEmpty(monthCategory) && (
              <BarChart
                data={monthCategory as ChartData<'bar'>}
                date={date}
                topTitle="カテゴリー別"
              />
            )}
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col sm="6">
            {!isObjEmpty(monthMethod) && (
              <DoughnutChart
                data={monthMethod as ChartData<'doughnut'>}
                date={date}
                middleTitle="支払い別"
              />
            )}
          </Col>
          <Col sm="6">
            {!isObjEmpty(monthMethod) && (
              <BarChart
                data={monthMethod as ChartData<'bar'>}
                date={date}
                topTitle="支払い別"
              />
            )}
          </Col>
        </Row>
      </Container>
      {initScript}
    </>
  );
};

export default Chart;
