-- 画像パス(画像パス保存テーブル)
SELECT 
  SERIAL_KEY -- シリアルキー
  , IMG_ID -- 画像ID
  , IMG_TYPE -- 画像のタイプ
  , IMG_PATH -- 画像名
  , IMG_NAME -- パス(相対/基本的にimagesフォルダ配下想定)
  , NOTE -- メモ
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  IMAGE;

