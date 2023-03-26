-- カテゴリー(カテゴリー定義テーブル)
SELECT 
  SERIAL_KEY -- シリアルキー
  , CAT_CODE -- カテゴリーコード
  , CAT_NAME -- カテゴリー名
  , CAT_TYPE -- タイプ(ラジオボタン用ー　用途はとりあえず決まってないけど何か別のカテゴリーを設定したくなった時用)
  , NOTE -- メモ
  , IMG_TYPE -- 画像タイプ(画像テーブル内のタイプと連動)
  , IMG_ID -- 画像のID
  , ACTIVE -- 有効かフラグ(有効化フラグ 1 = 有効 それ以外 = 無効)
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  CATEGORY;

