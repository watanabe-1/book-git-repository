-- デフォルトカテゴリーテーブル削除
DROP TABLE IF EXISTS DEFAULT_CATEGORY;
-- デフォルトカテゴリー(家計簿につける項目ごとのデフォルトカテゴリーを設定)
CREATE TABLE DEFAULT_CATEGORY (
  SERIAL_KEY SERIAL NOT NULL UNIQUE, -- シリアルキー
  USER_ID VARCHAR(50) NOT NULL, -- ユーザーID
  BOOKS_PLACE VARCHAR(255) NOT NULL, -- 場所(収入元、購入先)
  BOOKS_TYPE VARCHAR(100) NOT NULL, -- 帳簿の種類(収入、支出を選ぶ)
  BOOKS_METHOD VARCHAR(100) NOT NULL, -- 方法(受け取り方、支払い方)
  CAT_CODE VARCHAR(100) NOT NULL, -- カテゴリーコード
  INS_DATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
  INS_USER VARCHAR(50) NOT NULL DEFAULT CURRENT_USER, -- 登録ユーザー
  UPD_DATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
  UPD_USER VARCHAR(50) NOT NULL DEFAULT CURRENT_USER, -- 更新ユーザー
  PRIMARY KEY (USER_ID, BOOKS_PLACE, BOOKS_TYPE, BOOKS_METHOD) -- プライマリーキー
);
