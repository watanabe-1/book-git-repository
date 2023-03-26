-- アカウント(アカウント情報保持テーブル)
SELECT 
  SERIAL_KEY -- シリアルキー
  , USER_ID -- ユーザーID
  , PASSWORD -- パスワード
  , USER_NAME -- ユーザー名
  , ACCOUNT_TYPE -- アカウント種別
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  ACCOUNT;

