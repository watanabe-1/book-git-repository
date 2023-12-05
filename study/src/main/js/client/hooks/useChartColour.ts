import { ChartData } from 'chart.js';

import { useCommonSWR } from './useCommon';
import {
  InspectionPanelUi,
  ChartColourFormList,
} from '../../@types/studyUtilType';
import { urlConst } from '../../constant/urlConstant';

export const useInspectionPanelInfoSWR = () => {
  //console.log('call useInspectionPanelInfoSWR');
  return useCommonSWR<InspectionPanelUi>(
    (api) => api.getInfo(),
    urlConst.chartColour.INFO
  );
};

export const useChartColourListSWR = () => {
  //console.log('call useChartColourListSWR');
  return useCommonSWR<ChartColourFormList>(
    (api) => api.getListData(),
    urlConst.chartColour.LIST_DATA
  );
};

export const useActiveChartDataSWR = (token: Record<string, string>) => {
  //console.log('call useHouseholdDataSWR');
  return useCommonSWR<ChartData<'doughnut'> | ChartData<'bar'>>(
    (api) => api.getChartColourByActive(Number(token.qty)),
    [urlConst.chartColour.ACTIVE_CHART, token]
  );
};
