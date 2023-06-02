/**
 * api
 */
export type OnServerApi = {
  getImageList: () => string;
  getListData: () => string;
  getInfo: () => string;
  getHouseholdInfo: (param: object) => string;
  getHouseholdCalendarInfo: (param: object) => string;
  getHouseholdChartInfo: (param: object) => string;
  getDownloadInfo: () => string;
  getUploadInfo: () => string;
};