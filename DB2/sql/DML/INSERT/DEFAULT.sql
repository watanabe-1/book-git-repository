--カテゴリーテーブル
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('daily_use_items','日用品','','CATEGORY_ICON','daily_use_items_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('no_setting','未設定','','CATEGORY_ICON','no_setting_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('carfare','交通','','CATEGORY_ICON','carfare_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('utility_cost','水道・光熱','','CATEGORY_ICON','utility_cost_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('entertainment_expense','交際費','','CATEGORY_ICON','entertainment_expense_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('fashion','ファッション','','CATEGORY_ICON','fashion_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('data_communication','通信','','CATEGORY_ICON','data_communication_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('medical_bills','医療','','CATEGORY_ICON','medical_bills_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('food_expens','食費','','CATEGORY_ICON','food_expens_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('entertainment','娯楽','','CATEGORY_ICON','entertainment_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('house','住まい','','CATEGORY_ICON','house_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('salary','給与','','CATEGORY_ICON','salary_icon','1');
INSERT INTO CATEGORY(CAT_CODE,CAT_NAME,NOTE,IMG_TYPE,IMG_ID,ACTIVE) VALUES ('bonus','賞与','','CATEGORY_ICON','bonus_icon','1');

--画像テーブル
--画像なしの場合用
INSERT INTO IMAGE (IMG_ID, IMG_TYPE, IMG_PATH, IMG_NAME, NOTE) VALUES ('no_image', 'NO_IMAGE', '/images', 'no_image.png', '登録されていない場合用');
--カテゴリー用
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('house_icon','CATEGORY_ICON','/images/icon','house_icon.png','住まい');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('no_setting_icon','CATEGORY_ICON','/images/icon','no_setting_icon.png','未設定');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('entertainment_icon','CATEGORY_ICON','/images/icon','entertainment_icon.png','娯楽');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('food_expens_icon','CATEGORY_ICON','/images/icon','food_expens_icon.png','食費');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('daily_use_items_icon','CATEGORY_ICON','/images/icon','daily_use_items_icon.png','日用品');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('carfare_icon','CATEGORY_ICON','/images/icon','carfare_icon.png','交通費');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('utility_cost_icon','CATEGORY_ICON','/images/icon','utility_cost_icon.png','水道・光熱');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('entertainment_expense_icon','CATEGORY_ICON','/images/icon','entertainment_expense_icon.png','交際費');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('fashion_icon','CATEGORY_ICON','/images/icon','fashion_icon.png','ファッション');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('data_communication_icon','CATEGORY_ICON','/images/icon','data_communication_icon.png','通信費');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('medical_bills_icon','CATEGORY_ICON','/images/icon','medical_bills_icon.png','医療');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('salary_icon','CATEGORY_ICON','/images/icon','salary_icon.png','給与');
INSERT INTO IMAGE(IMG_ID,IMG_TYPE,IMG_PATH,IMG_NAME,NOTE) VALUES ('bonus_icon','CATEGORY_ICON','/images/icon','bonus_icon.png','賞与');

--コードマスタ
--図で使用する色を生成するためのシード値を定義
-- INSERT INTO CODELIST (LISTNAME, DESCRIPTION)
--     VALUES('chart_rgb_color', '図で使用する色を生成するためのシード値作成用係数');
-- INSERT INTO CODELKUP (LISTNAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUR, SEQUENCE)
--     VALUES('chart_rgb_color', 'r',  'r_図で使用する色を生成するためのシード値作成用係数', '1', '1', '1000')
--             ,('chart_rgb_color', 'g',  'g_図で使用する色を生成するためのシード値作成用係数', '2', '2', '1100')
--             ,('chart_rgb_color', 'b',  '図で使用する色を生成するためのシード値作成用係数', '3', '3', '1200');

--図で使用する色を生成するためのデフォルトシード値を定義
INSERT INTO TEMPLATECHARTCOLOUR (TEMPLATE_ID, TEMPLATE_NAME, USER_ID, ACTIVE, SEED_COEFF_R, SEED_COEFF_G, SEED_COEFF_B, NOTE) VALUES ('default1', 'デフォルト1', 'common', '1', '5973763', '727430704', '326989594', 'デフォルト1');

--test
INSERT INTO ACCOUNT (USER_ID, PASSWORD, USER_NAME, ACCOUNT_TYPE) VALUES ('test', '$10$po.7dDhl7fWeu9wp4LcpkOAuBme9mugBW1Bo2HyVSSgWzGVTcuSCq', 'test', '03');
--test2
--INSERT INTO ACCOUNT (USER_ID, PASSWORD, USER_NAME, ACCOUNT_TYPE) VALUES ('wata', '$2a$10$2b63yBRUi0F8fadJmZTkqu.k1Z.9tOLYsEjN/hgm8NMNgfr//LGSe', 'wata', '01');
--test3
INSERT INTO ACCOUNT (USER_ID, PASSWORD, USER_NAME, ACCOUNT_TYPE) VALUES ('admin', '$2a$10$A20zzLB2XpvjOPn7wN/Olu0MoIk8ilS4tfV.AXsxln.l/zt.PrQsm', 'admin', '01');
