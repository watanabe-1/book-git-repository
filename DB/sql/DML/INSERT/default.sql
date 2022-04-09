--画像テーブル
--画像なしの場合用
insert into IMAGE (IMG_ID, IMG_TYPE, IMG_PATH, IMG_NAME, NOTE)
      values ('no_image', 'NO_IMAGE', '/images', 'no_image.png', '登録されていない場合用');

--コードマスタ
--図で使用する色を生成するためのシード値を定義
-- insert into CODELIST (LISTNAME, DESCRIPTION)
--     values('chart_rgb_color', '図で使用する色を生成するためのシード値作成用係数');
-- insert into CODELKUP (LISTNAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUR, SEQUENCE)
--     values('chart_rgb_color', 'r',  'r_図で使用する色を生成するためのシード値作成用係数', '1', '1', '1000')
--             ,('chart_rgb_color', 'g',  'g_図で使用する色を生成するためのシード値作成用係数', '2', '2', '1100')
--             ,('chart_rgb_color', 'b',  '図で使用する色を生成するためのシード値作成用係数', '3', '3', '1200');

--図で使用する色を生成するためのデフォルトシード値を定義
insert into TEMPLATECHARTCOLOUR (TEMPLATE_ID, TEMPLATE_NAME, USER_ID, ACTIVE, SEED_COEFF_R, SEED_COEFF_G, SEED_COEFF_B, NOTE)
    values ('default1', 'デフォルト1', 'common', '1', '1', '2', '3', '微妙');
