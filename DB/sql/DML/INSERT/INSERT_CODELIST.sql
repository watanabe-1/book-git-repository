-- 図の色確認画面図色数
DELETE FROM CODELIST WHERE LIST_NAME = 'chart_colour_num';
INSERT INTO CODELIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('chart_colour_num', '図の色確認画面図色数', '1');
-- 図の色確認画タブ
DELETE FROM CODELIST WHERE LIST_NAME = 'chart_colour_tab';
INSERT INTO CODELIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('chart_colour_tab', '図の色確認画タブ', '1');
-- 家計簿画面タブ
DELETE FROM CODELIST WHERE LIST_NAME = 'books_tab';
INSERT INTO CODELIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('books_tab', '家計簿画面タブ', '1');