//共通変数、共通関数、共通クラスはcreateDbStrUtil.gsに定義
//gasではプロジェクト内のファイルらは実行時？（jsへコンパイル時？）にすべて一つのファイルとして扱われるためimportは必要ないらしい
//APIを呼ぶ場合とても時間がかかる。例えばSpreadsheetからデータを取得したり、更新したり。
//なので基本的には1度にシートの中身をすべて取得しちゃうのがいい。
//更新も同じで1度にすべて更新したほうが良い。

/**
 * DB定義に定義されたすべてのテーブルのCREATE文を作成
 */
function createPostgreCreateSqlAll() {
  //テーブル一覧シートを取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("テーブル一覧");
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();
  //出力ファイル名
  const fileName = "CREATE_ALL.sql";
  //出力フォルダ
  const faldaID = getProperty("sql_create_all_dir");

  let content = "";
  //メイン処理
  for (var j = 3; j <= lastRow; j++) {
    //シート名を引数に渡し、DROP文の作成
    content += getPostgreDropSql(values[j - 1][0]) + sqlKaigyo;
    //シート名を引数に渡し、CREATE文の作成
    content += getPostgreCreateSql(values[j - 1][0]) + sqlKaigyo;
    //シート名を引数に渡し、CREATE INDEX文の作成
    const createIndexSql = getPostgreCreateIndexSql(values[j - 1][0]);
    if (createIndexSql) {
      content += createIndexSql + repeatConcatStr(sqlKaigyo, 2);
    } else {
      content += sqlKaigyo;
    }
  }

  //ファイルを作成し出力
  createFile(fileName, content, faldaID)
}

/**
 * 呼び出し元シートに定義してあるテーブルのCREATE文を作成
 */
function createPostgreCreateSql() {
  //アクティブシートを取得
  const sheet = SpreadsheetApp.getActiveSheet();
  //アクティブシート名を取得
  const sheetName = sheet.getName();
  // 物理名を取得
  const tbEnName = sheet.getRange(3, 2).getValue();
  //出力ファイル名
  const fileName = "CREATE_" + tbEnName + ".sql";
  //出力フォルダ
  const faldaID = getProperty("sql_create_dir");

  let content = "";
  //メイン処理
  //シート名を引数に渡し、DROP文の作成
  content += getPostgreDropSql(sheetName) + sqlKaigyo;
  //シート名を引数に渡し、CREATE文の作成
  content += getPostgreCreateSql(sheetName) + sqlKaigyo;
  //シート名を引数に渡し、CREATE INDEX文の作成
  const createIndexSql = getPostgreCreateIndexSql(sheetName);
  if (createIndexSql) {
    content += createIndexSql + repeatConcatStr(sqlKaigyo, 2);
  } else {
    content += sqlKaigyo;
  }

  //ファイルを作成し出力
  createFile(fileName, content, faldaID)
}

/**
 * DB定義に定義されたすべてのテーブルのSELECT文を作成
 */
function createPostgreSelectSqlAll() {
  //テーブル一覧シートを取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("テーブル一覧");
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();
  //出力ファイル名
  const fileName = "SELECT_ALL.sql";
  //出力フォルダ
  const faldaID = getProperty("sql_select_all_dir");

  let content = "";
  //メイン処理
  for (var j = 3; j <= lastRow; j++) {
    //シート名を引数に渡し、SELECT文の作成
    content += getPostgreSelectSql(values[j - 1][0]) + repeatConcatStr(sqlKaigyo, 2)
  }

  //ファイルを作成し出力
  createFile(fileName, content, faldaID)
}

/**
 * 呼び出し元シートに定義してあるテーブルのSELECT文を作成
 */
function createPostgreSelectSql() {
  //アクティブシートを取得
  const sheet = SpreadsheetApp.getActiveSheet();
  //アクティブシート名を取得
  const sheetName = sheet.getName();
  // 物理名を取得
  const tbEnName = sheet.getRange(3, 2).getValue();
  //出力ファイル名
  const fileName = "SELECT_" + tbEnName + ".sql";
  //出力フォルダ
  const faldaID = getProperty("sql_select_dir");

  let content = "";
  //メイン処理
  //シート名を引数に渡し、SELECT文の作成
  content += getPostgreSelectSql(sheetName) + repeatConcatStr(sqlKaigyo, 2)

  //ファイルを作成し出力
  createFile(fileName, content, faldaID)
}

/**
 * 引数で指定したテーブルのpostgreSqlのCREATE文を取得
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} postgresqlのcreate文
 */
function getPostgreCreateSql(sheetName) {
  //sheetName = "画像パス"
  // シート名を指定してシートを取得
  const sheet = SpreadsheetApp.
    getActiveSpreadsheet().getSheetByName(sheetName);
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();
  // テーブル名を取得
  const tbJaName = values[2][0];
  // 物理名を取得
  const tbEnName = values[2][1];
  // テーブル備考を取得
  const tbNote = values[2][3];

  //プライマリキー対象
  let primaryStr = "";
  //SQL文の作成
  let sqlStr = sqlComment + tbJaName + "(" + tbNote + ")" + sqlKaigyo
    + "CREATE TABLE " + tbEnName + " (" + sqlKaigyo;
  for (var j = 5; j <= lastRow; j++) {
    const dbTeigi = new DbTeigi(values[j - 1]);
    //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
    //カラム物理名、データ型
    if (dbTeigi.colen) {
      sqlStr += sqlIndent + dbTeigi.colen + " " + dbTeigi.type;
      //桁数
      if (dbTeigi.digit) {
        sqlStr += "(" + dbTeigi.digit;
        //精度
        if (dbTeigi.precision) {
          sqlStr += "," + dbTeigi.precision;
        }
        sqlStr += ")";
      }
      //NULL許容
      if (dbTeigi.nullStr) {
        sqlStr += " ";
        if (dbTeigi.nullStr == no) {
          sqlStr += "NOT ";
        }
        sqlStr += "NULL";
      }
      //初期値
      if (dbTeigi.defaultStr) {
        sqlStr += " DEFAULT " + dbTeigi.defaultStr;
      }
      //ユニーク
      if (dbTeigi.unique) {
        if (dbTeigi.unique == yes) {
          sqlStr += " UNIQUE";
        };
      }
      //カンマ、コメント
      sqlStr += ", " + sqlComment;
      //カラム物理名（日本語）
      if (dbTeigi.colja) {
        sqlStr += dbTeigi.colja;
      }
      //備考
      if (dbTeigi.note) {
        sqlStr += "(" + dbTeigi.note + ")";
      }
      //改行
      sqlStr += sqlKaigyo;
      //プライマリキー対象
      if (dbTeigi.primary) {
        if (dbTeigi.primary == yes) {
          primaryStr += dbTeigi.colen + ", ";
        }
      }
    }
  }
  //プライマリキー
  if (primaryStr) {
    sqlStr += sqlIndent + "PRIMARY KEY (" + primaryStr.slice(0, -2) + ") -- プライマリーキー" + sqlKaigyo;
  } else {
    //最後に付け加えた「,」だけを削除
    sqlStr = deleteLastStr(sqlStr, ",");
  }
  sqlStr += ");"
  //console.log(sqlStr);
  return sqlStr;
}

/**
 * 引数で指定したテーブルのpostgreSqlのCREATE INDEX文を取得
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} postgresqlのCREATE INDEX文
 */
function getPostgreCreateIndexSql(sheetName) {

  // シート名を指定してシートを取得
  const sheet = SpreadsheetApp.
    getActiveSpreadsheet().getSheetByName(sheetName);
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();
  // テーブル名を取得
  const tbJaName = values[2][0];
  // 物理名を取得
  const tbEnName = values[2][1];

  //SQL文の説明コメント
  let sqlStr = "";
  //SQL文の作成
  //文字列を保持するための配列の作成
  let str1 = getBlankArray(1);
  let str2 = getBlankArray(1);
  for (var j = 5; j <= lastRow; j++) {
    const dbTeigi = new DbTeigi(values[j - 1]);
    str1 = getConcatColen(str1, dbTeigi.ind1, dbTeigi.colen);
    str2 = getConcatColen(str2, dbTeigi.ind2, dbTeigi.colen);
  }
  //配列の中身を結合
  //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
  if (str1[0]) {
    sqlStr += getCreateIndexSql(str1) + ");";
  }
  if (str2[0]) {
    sqlStr += sqlKaigyo + getCreateIndexSql(str2) + ");";
  }
  //SQL文の説明コメント
  if (sqlStr) {
    sqlStr = sqlComment + tbJaName + "テーブルにINDEXを作成" + sqlKaigyo + sqlStr;
  }
  //console.log(sqlStr);
  return sqlStr;

  /**
   * INDEX文対象だった場合物理名を連結して返す
   * @param {string} index index
   * @param {string} colen 物理名
   * @return {string} 連結した文字列を保持する配列
   */
  function getConcatColen(str, index, colen) {
    //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
    if (index && index == yes) {
      str[0] += colen + ",";
      str[1] += colen + "、";
    }
    return str;
  }
  /**
   * 引数分の添え字を持った中身がブランクの配列を返却
   * @param {int} maxIndex 添え字
   * @return {string} postgresqlのCREATE INDEX文
   */
  function getBlankArray(maxIndex) {
    let str = [];
    for (var i = 0; i <= maxIndex; i++) {
      str[i] = "";
    }
    return str;
  }
  /**
   * postgreSqlのINDEX文の元が入っている配列の中身を連結して返却
   * @return {string} postgresqlのCREATE INDEX文
   */
  function getCreateIndexSql(str) {
    return sqlComment + str[1].slice(0, -1) + sqlKaigyo
      + "CREATE INDEX ON " + tbEnName + "(" + str[0].slice(0, -1);
  }
}

/**
 * 引数で指定したテーブルのpostgreSqlのDROP文を取得
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} postgresqlのDROP文
 */
function getPostgreDropSql(sheetName) {
  // シート名を指定してシートを取得
  const sheet = SpreadsheetApp.
    getActiveSpreadsheet().getSheetByName(sheetName);
  // テーブル名を取得
  const tbJaName = sheet.getRange(3, 1).getValue();
  // 物理名を取得
  const tbEnName = sheet.getRange(3, 2).getValue();

  //SQL文の作成
  let sqlStr = sqlComment + tbJaName + "テーブル削除" + sqlKaigyo
    + "DROP TABLE IF EXISTS " + tbEnName + ";";

  return sqlStr;
}

/**
 * 引数で指定したテーブルのpostgreSqlのSELECT文を取得
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} postgresqlのSELECT文
 */
function getPostgreSelectSql(sheetName) {

  // シート名を指定してシートを取得
  const sheet = SpreadsheetApp.
    getActiveSpreadsheet().getSheetByName(sheetName);
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();
  // テーブル名を取得
  const tbJaName = values[2][0];
  // 物理名を取得
  const tbEnName = values[2][1];
  // テーブル備考を取得
  const tbNote = values[2][3];

  //SQL文の作成
  let sqlStr = sqlComment + tbJaName + "(" + tbNote + ")" + sqlKaigyo
    + "SELECT " + sqlKaigyo;
  for (var j = 5; j <= lastRow; j++) {
    const dbTeigi = new DbTeigi(values[j - 1]);
    //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
    //カラム物理名
    if (dbTeigi.colen) {
      sqlStr += sqlIndent;
      //1週目はカンマなし、それ以外はカンマつける
      if (j > 5) {
        sqlStr += ", ";
      }
      //カラム物理名、コメント
      sqlStr += dbTeigi.colen + " " + sqlComment;
      //カラム物理名（日本語）
      if (dbTeigi.colja) {
        sqlStr += dbTeigi.colja;
      }
      //備考
      if (dbTeigi.note) {
        sqlStr += "(" + dbTeigi.note + ")";
      }
      //改行
      sqlStr += sqlKaigyo;
    }
  }
  //from句以下
  sqlStr += "FROM" + sqlKaigyo + sqlIndent + tbEnName + ";";
  //console.log(sqlStr);
  return sqlStr;
}






