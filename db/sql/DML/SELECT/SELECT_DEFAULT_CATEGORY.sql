-- デフォルトカテゴリー(家計簿につける項目ごとのデフォルトカテゴリーを設定)
SELECT 
  SERIAL_KEY -- シリアルキー
  , DEFAULT_CATEGORY_ID -- デフォルトカテゴリーID
  , USER_ID -- ユーザーID
  , BOOKS_PLACE -- 場所(収入元、購入先)
  , BOOKS_TYPE -- 帳簿の種類(収入、支出を選ぶ)
  , BOOKS_METHOD -- 方法(受け取り方、支払い方)
  , BOOKS_AMMOUNT_MIN -- 金額(最小値)(金額(最小値) マイナスの場合は検索対象から除外)
  , BOOKS_AMMOUNT_MAX -- 金額(最大値)(金額(最大値) マイナスの場合は検索対象から除外)
  , CAT_CODE -- カテゴリーコード
  , PRIORITY -- 優先度(優先順(昇順))
  , REGEX_ENABLED -- 正規表現使用可否(正規表現使用可否 1 = 使用 それ以外 = 使用しない)
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  DEFAULT_CATEGORY;

