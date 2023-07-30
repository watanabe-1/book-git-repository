-- 図の色確認画面図色数
DELETE FROM CODE_LIST WHERE LIST_NAME = 'chart_colour_num';
INSERT INTO CODE_LIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('chart_colour_num', '図の色確認画面図色数', '1');
-- 図の色確認画面タブ
DELETE FROM CODE_LIST WHERE LIST_NAME = 'chart_colour_tab';
INSERT INTO CODE_LIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('chart_colour_tab', '図の色確認画面タブ', '1');
-- 図の色確認画面ランダム表示数
DELETE FROM CODE_LIST WHERE LIST_NAME = 'chart_colour_random_num';
INSERT INTO CODE_LIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('chart_colour_random_num', '図の色確認画面ランダム表示数', '1');
-- 家計簿画面タブ
DELETE FROM CODE_LIST WHERE LIST_NAME = 'books_tab';
INSERT INTO CODE_LIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('books_tab', '家計簿画面タブ', '1');
-- デフォルトカテゴリー置き換え対象カテゴリー
DELETE FROM CODE_LIST WHERE LIST_NAME = 'default_category_target';
INSERT INTO CODE_LIST (LIST_NAME, DESCRIPTION, EDITABLE)
  VALUES ('default_category_target', 'デフォルトカテゴリー置き換え対象カテゴリー', '1');