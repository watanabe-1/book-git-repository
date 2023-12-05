/** URL Base Paths */
const BASE_PATHS = {
  CATEGORY: '/category',
  DEFAULT_CATEGORY: '/defaultCategory',
  BOOKS: '/books',
  CHART_COLOUR: '/chartColour',
  COMMON: '/common',
};

/** URL */
export const urlConst = {
  /** カテゴリー */
  category: {
    INFO: `${BASE_PATHS.CATEGORY}/info`,
    CONFIRM: `${BASE_PATHS.CATEGORY}/confirm`,
    RESULT: `${BASE_PATHS.CATEGORY}/result`,
    LIST: `${BASE_PATHS.CATEGORY}/list`,
    LIST_DATA: `${BASE_PATHS.CATEGORY}/listData`,
    IMAGE_LIST_DATA: `${BASE_PATHS.CATEGORY}/imageListData`,
    LIST_DATA_UPDATE: `${BASE_PATHS.CATEGORY}/listDataUpdate`,
  },

  /** デフォルトカテゴリー */
  defaultCategory: {
    INFO: `${BASE_PATHS.DEFAULT_CATEGORY}/info`,
    LIST_DATA: `${BASE_PATHS.DEFAULT_CATEGORY}/listData`,
    LIST_DATA_UPDATE: `${BASE_PATHS.DEFAULT_CATEGORY}/listDataUpdate`,
    LIST_DATA_PUSH: `${BASE_PATHS.DEFAULT_CATEGORY}/listDataPush`,
    INPUT_ALL: `${BASE_PATHS.DEFAULT_CATEGORY}/inputAll`,
  },

  /** 家計簿 */
  books: {
    UPLOAD_INFO: `${BASE_PATHS.BOOKS}/uploadInfo`,
    DOWNLOAD_INFO: `${BASE_PATHS.BOOKS}/downloadInfo`,
    CONVERT_INFO: `${BASE_PATHS.BOOKS}/convertInfo`,
    HOUSEHOLD_INFO: `${BASE_PATHS.BOOKS}/householdInfo`,
    HOUSEHOLD_CHART_INFO: `${BASE_PATHS.BOOKS}/householdChartInfo`,
    HOUSEHOLD_CALENDAR_INFO: `${BASE_PATHS.BOOKS}/householdCalendarInfo`,
    RESULT: `${BASE_PATHS.BOOKS}/result`,
    DOWNLOAD: `${BASE_PATHS.BOOKS}/download`,
    CONVERT_FILE: `${BASE_PATHS.BOOKS}/convertFile`,
    HOUSEHOLD: `${BASE_PATHS.BOOKS}/household`,
    LIST_DATA_PUSH: `${BASE_PATHS.BOOKS}/listDataPush`,
    LIST_DATA: `${BASE_PATHS.BOOKS}/listData`,
    LIST_DATA_UPDATE: `${BASE_PATHS.BOOKS}/listDataUpdate`,
  },

  /** 色確認 */
  chartColour: {
    INFO: `${BASE_PATHS.CHART_COLOUR}/info`,
    LIST_DATA: `${BASE_PATHS.CHART_COLOUR}/listData`,
    LIST_DATA_PUSH: `${BASE_PATHS.CHART_COLOUR}/listDataPush`,
    LIST_DATA_UPDATE: `${BASE_PATHS.CHART_COLOUR}/listDataUpdate`,
    ACTIVE_CHART: `${BASE_PATHS.CHART_COLOUR}/activeChart`,
  },

  /** 共通 */
  common: {
    COMMON_INFO: `${BASE_PATHS.COMMON}/info`,
  },
};
