-- コードリストテーブル削除
DROP TABLE IF EXISTS CODELIST;
-- コードリスト(コード定義テーブル(ヘッダー))
CREATE TABLE CODELIST (
  SERIAL_KEY SERIAL NOT NULL UNIQUE, -- シリアルキー
  LIST_NAME VARCHAR(50) NOT NULL, -- リストネーム
  DESCRIPTION VARCHAR(255) NULL, -- 説明
  EDITABLE VARCHAR(1) NULL DEFAULT '1', -- 編集可否(編集可否 1 = 可能 それ以外 = 不可)
  INS_DATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
  INS_USER VARCHAR(50) NOT NULL DEFAULT CURRENT_USER, -- 登録ユーザー
  UPD_DATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
  UPD_USER VARCHAR(50) NOT NULL DEFAULT CURRENT_USER, -- 更新ユーザー
  PRIMARY KEY (LIST_NAME) -- プライマリーキー
);

