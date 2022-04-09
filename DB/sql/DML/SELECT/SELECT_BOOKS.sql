-- 家計簿(家計簿データ保存テーブル)
SELECT 
  SERIAL_KEY -- シリアルキー
  , BOOKS_ID -- 家計簿ID
  , BOOKS_TYPE -- 帳簿の種類(収入、支出を選ぶ)
  , BOOKS_DATE -- 日付(収入日、購入日)
  , BOOKS_PLACE -- 場所(収入元、購入先)
  , CAT_CODE -- カテゴリーコード
  , BOOKS_METHOD -- 方法(受け取り方、支払い方)
  , BOOKS_AMMOUNT -- 金額
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  BOOKS;

