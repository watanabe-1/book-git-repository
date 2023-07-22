import { useCommonSWR } from './useCommon';
import {
  BooksUi,
  BooksConvertUi,
  HouseholdUi,
} from '../../@types/studyUtilType';
import { urlConst } from '../../constant/urlConstant';
import { parseDate } from '../../study/util/studyDateUtil';
import { HouseholdCalendarData } from '../features/books/household/components/Calendar';
import { HouseholdChartData } from '../features/books/household/components/Chart';

export const useConvertInfoSWR = () => {
  //console.log('call useConvertInfoSWR');
  return useCommonSWR<BooksConvertUi>(
    (api) => api.getConvertInfo(),
    urlConst.books.CONVERT_INFO
  );
};

export const useDownloadtInfoSWR = () => {
  //console.log('call useDownloadtInfoSWR');
  return useCommonSWR<BooksUi>(
    (api) => api.getDownloadInfo(),
    urlConst.books.DOWNLOAD_INFO
  );
};

export const useUploadtInfoSWR = () => {
  //console.log('call useUploadtInfoSWR');
  return useCommonSWR<BooksUi>(
    (api) => api.getUploadInfo(),
    urlConst.books.UPLOAD_INFO
  );
};

export const useHouseholdInfoSWR = (token: Record<string, string>) => {
  //console.log('call useHouseholdInfoSWR');
  return useCommonSWR<HouseholdUi>(
    (api) => api.getHouseholdInfo(parseDate(token.date, token.dateFormat)),
    [urlConst.books.HOUSEHOLD_INFO, token]
  );
};

export const useHouseholdChartInfoSWR = (token: Record<string, string>) => {
  //console.log('call useHouseholdChartInfoSWR');
  return useCommonSWR<HouseholdChartData>(
    (api) => api.getHouseholdChartInfo(parseDate(token.date, token.dateFormat)),
    [urlConst.books.HOUSEHOLD_CHART_INFO, token]
  );
};

export const useHouseholdCalendarInfoSWR = (token?: Record<string, string>) => {
  //console.log('call useHouseholdCalendarInfoSWR');
  return useCommonSWR<HouseholdCalendarData>(
    (api) =>
      api.getHouseholdCalendarInfo(parseDate(token.date, token.dateFormat)),
    [urlConst.books.HOUSEHOLD_CALENDAR_INFO, token]
  );
};
