import { ChartData } from 'chart.js';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { isObjEmpty } from '../../../../../study/util/studyUtil';
import BarChart from '../../../../components/elements/chart/BarChart';
import DoughnutChart from '../../../../components/elements/chart/DoughnutChart';

/**
 * プロップス
 */
type ChartProps = {
  /** チャート用データ */
  chartData: ChartData<'doughnut'> | ChartData<'bar'>;
  /** 日付 */
  date: Date;
};

const Chart: React.FC<ChartProps> = ({ chartData, date }) => {
  return (
    <Container>
      <Row>
        <Col sm="6">
          {!isObjEmpty(chartData) && (
            <DoughnutChart
              data={chartData as ChartData<'doughnut'>}
              date={date}
              middleTitle="ドーナツ"
            />
          )}
        </Col>
        <Col sm="6">
          {!isObjEmpty(chartData) && (
            <BarChart
              data={chartData as ChartData<'bar'>}
              date={date}
              topTitle="ホライゾンバー"
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chart;
