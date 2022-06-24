-- 図の色確認画面図色数-初期数
DELETE FROM CODELKUP WHERE LIST_NAME = 'chart_colour_num' AND CODE = 'defalt_data_cnt';
INSERT INTO CODELKUP (LIST_NAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUE, EDITABLE, ACTIVE, SEQUENCE, UDF1, UDF2, UDF3, UDF4, UDF5, UDF6, UDF7, NOTE)
  VALUES ('chart_colour_num', 'defalt_data_cnt', '図の色確認画面図色数-初期数', '20', '20', '1', '1', '1', '', '', '', '', '', '', '', '');
-- 図の色確認画面図色数-最大数
DELETE FROM CODELKUP WHERE LIST_NAME = 'chart_colour_num' AND CODE = 'max_data_cnt';
INSERT INTO CODELKUP (LIST_NAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUE, EDITABLE, ACTIVE, SEQUENCE, UDF1, UDF2, UDF3, UDF4, UDF5, UDF6, UDF7, NOTE)
  VALUES ('chart_colour_num', 'max_data_cnt', '図の色確認画面図色数-最大数', '1000', '1000', '1', '1', '2', '', '', '', '', '', '', '', '');
-- 図の色確認画タブ-初期表示
DELETE FROM CODELKUP WHERE LIST_NAME = 'chart_colour_tab' AND CODE = 'defalt_tab';
INSERT INTO CODELKUP (LIST_NAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUE, EDITABLE, ACTIVE, SEQUENCE, UDF1, UDF2, UDF3, UDF4, UDF5, UDF6, UDF7, NOTE)
  VALUES ('chart_colour_tab', 'defalt_tab', '図の色確認画タブ-初期表示', 'tab1', 'tab1', '1', '1', '1', '', '', '', '', '', '', '', '');
-- 図の色確認画タブ-保存後表示
DELETE FROM CODELKUP WHERE LIST_NAME = 'chart_colour_tab' AND CODE = 'result_tab';
INSERT INTO CODELKUP (LIST_NAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUE, EDITABLE, ACTIVE, SEQUENCE, UDF1, UDF2, UDF3, UDF4, UDF5, UDF6, UDF7, NOTE)
  VALUES ('chart_colour_tab', 'result_tab', '図の色確認画タブ-保存後表示', 'tab2', 'tab2', '1', '1', '2', '', '', '', '', '', '', '', '');
-- 家計簿画面タブ-初期表示
DELETE FROM CODELKUP WHERE LIST_NAME = 'books_tab' AND CODE = 'defalt_tab';
INSERT INTO CODELKUP (LIST_NAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUE, EDITABLE, ACTIVE, SEQUENCE, UDF1, UDF2, UDF3, UDF4, UDF5, UDF6, UDF7, NOTE)
  VALUES ('books_tab', 'defalt_tab', '家計簿画面タブ-初期表示', 'tab1', 'tab1', '1', '1', '1', '', '', '', '', '', '', '', '');