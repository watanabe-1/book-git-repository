import { ChartData } from 'chart.js';
import React, { useMemo } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { createDate } from '../../../../../study/util/studyDateUtil';
import { isObjEmpty } from '../../../../../study/util/studyUtil';
import BarAndLineChart from '../../../../components/elements/chart/BarAndLineChart';
import BarChart from '../../../../components/elements/chart/BarChart';
import DoughnutChart from '../../../../components/elements/chart/DoughnutChart';
import {
  useHouseholdChartInfoSWR,
  useHouseholdChartInfoStaticKeySWR,
  useHouseholdInfoSWR,
} from '../../../../hooks/useBooks';
import { useCommonInfoSWR } from '../../../../hooks/useCommon';
import { buildChartParam, buildInfoParam } from '../functions/param';
import { useDateParam } from '../hooks/useParam';

/**
 * 家計簿図用データ
 */
export type HouseholdChartData = {
  monthCategory: ChartData<'doughnut'> | ChartData<'bar'>;
  monthMethod: ChartData<'doughnut'> | ChartData<'bar'>;
  yearAll: ChartData<'bar'>;
};

const Chart = () => {
  const { data: commonInfo } = useCommonInfoSWR();
  const paramDate = useDateParam();

  const infoParam = useMemo(
    () => buildInfoParam(paramDate, commonInfo.dateFormat),
    [paramDate, commonInfo.dateFormat]
  );
  const { data: info } = useHouseholdInfoSWR(infoParam);

  const { data: chartInfoStaticKey } = useHouseholdChartInfoStaticKeySWR();

  const date = useMemo(
    () => createDate(info.year, info.month),
    [info.year, info.month]
  );

  const chartInfoParm = useMemo(
    () => buildChartParam(date, commonInfo.dateFormat, chartInfoStaticKey),
    [date, commonInfo.dateFormat, chartInfoStaticKey]
  );
  const { data: chartData, initScript } =
    useHouseholdChartInfoSWR(chartInfoParm);

  const { monthCategory, monthMethod, yearAll } = chartData;
  // console.log('chartdata');
  // console.log(chartData);

  return (
    <>
      <Container>
        <Row>
          <Col sm="12">
            {!isObjEmpty(yearAll) && (
              <BarAndLineChart data={yearAll} topTitle="過去12ヶ月" />
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
