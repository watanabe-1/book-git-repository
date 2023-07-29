-- デフォルトカテゴリー(家計簿につける項目ごとのデフォルトカテゴリーを設定)
SELECT 
  SERIAL_KEY -- シリアルキー
  , USER_ID -- ユーザーID
  , BOOKS_PLACE -- 場所(収入元、購入先)
  , BOOKS_TYPE -- 帳簿の種類(収入、支出を選ぶ)
  , BOOKS_METHOD -- 方法(受け取り方、支払い方)
  , CAT_CODE -- カテゴリーコード
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  DEFAULT_CATEGORY;

