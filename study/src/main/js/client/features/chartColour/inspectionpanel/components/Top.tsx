import React, { useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Chart from './Chart';
import ListTable from './ListTable';
import { parseDate } from '../../../../../study/util/studyDateUtil';
import {
  useActiveChartDataSWR,
  useInspectionPanelInfoSWR,
} from '../../../../hooks/useChartColour';
import { buildChartParam } from '../functions/param';
import { useQtyParam } from '../hooks/useParam';

const Top = () => {
  const { data: info } = useInspectionPanelInfoSWR();

  const qty = useQtyParam();

  const chartParam = useMemo(() => buildChartParam(qty), [qty]);

  const { data: chartData, initScript: chartDataScript } =
    useActiveChartDataSWR(chartParam);

  const date = useMemo(
    () => parseDate(info.date, info.dateFormat),
    [info.date, info.dateFormat]
  );

  return (
    <>
      <Container>
        <Row>
          <ListTable onlyActive readonly isSort={false} isFilter={false} />
        </Row>
        <Row>
          <Chart date={date} chartData={chartData} />
        </Row>
      </Container>
      {chartDataScript}
    </>
  );
};

export default Top;
