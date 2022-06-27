

/**
 * 呼び出し元シートに定義してあるコードのINSERT文を作成
 */
function createPostgreCodeInsertSql() {
  const codeSheetName = "コード定義"
    // シート名を指定してシートを取得
  const sheet = SpreadsheetApp.
    getActiveSpreadsheet().getSheetByName(codeSheetName);
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();

  //出力ファイル名
  const codeListFileName = "INSERT_CODELIST.sql";
  const codeLkupFileName = "INSERT_CODELKUP.sql";
  //出力フォルダ
  const faldaID = getProperty("sql_insert_dir");

  //メイン処理
  //シート名を引数に渡し、INSERT文の作成
  //ファイルを作成し出力
  createFile(codeListFileName, getPostgreCodeListInsertSql(values, lastRow), faldaID)
  createFile(codeLkupFileName, getPostgreCodeLkupInsertSql(values, lastRow), faldaID)
}

/**
 * 呼び出し元シートに定義してあるコードのjavaのenumを作成
 */
function createCodeEnumJava() {
  const codeSheetName = "コード定義"
    // シート名を指定してシートを取得
  const sheet = SpreadsheetApp.
    getActiveSpreadsheet().getSheetByName(codeSheetName);
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();

  //出力フォルダ
  const faldaID = getProperty("java_enum_dir");

  const codeMap = new Map();
  const descriptionMap = new Map();
  for (var j = 7; j <= lastRow; j++) {
    const codeTeigi = new CodeTeigi(values[j - 1]);
    let codes = codeMap.get(codeTeigi.listName);
    if(!codes){
      codes = new Map();
      codes.set(codeTeigi.code, codeTeigi.description);
    } else {
      if(!codes.get(codeTeigi.code)){
        codes.set(codeTeigi.code, codeTeigi.description);
      }
    }
    codeMap.set(codeTeigi.listName, codes);
    if(!descriptionMap.get(codeTeigi.listName)){
      descriptionMap.set(codeTeigi.listName, codeTeigi.descriptionHead);
    }
  }

  //javadoc対象に引数(param)がある場合
  if (codeMap) {
    // keysメソッドの戻り値(Iterator)を反復処理する
    for (const listName of codeMap.keys()) {
      if (codeMap.get(listName)) {
        //メイン処理
        //シート名を引数に渡し、INSERT文の作成
        //ファイルを作成し出力
        createFile(capitalize(toCamelCase(listName)) + ".java", getCodeEnumJava(listName, descriptionMap.get(listName), codeMap.get(listName)), faldaID);
      }
    }
  }
}

/**
 * コード定義からcodelistテーブルのinsert文の作成
 * @param {Object} values code定義データリスト
 * @param {integer} lastRow 最終行数
 * @return {string} postgresqlのcode_listテーブルのinsert
 */
function getPostgreCodeListInsertSql(values, lastRow) {
  // 物理名を取得
  const tbEnName = "CODELIST";
  const codeLists = [];
  //SQL文の作成
  let sqlStr = ""
  for (var j = 7; j <= lastRow; j++) {
    const codeTeigi = new CodeTeigi(values[j - 1]);

    //listnameが被っているものについては複数sql作成しない
    if(codeLists.indexOf(codeTeigi.listName) < 0){
      codeLists.push(codeTeigi.listName);

      sqlStr += sqlComment  + codeTeigi.descriptionHead + sqlKaigyo;
      sqlStr += "DELETE FROM " + tbEnName + " WHERE LIST_NAME = '" + codeTeigi.listName + "';" + sqlKaigyo;
      sqlStr += "INSERT INTO " + tbEnName + " (LIST_NAME, DESCRIPTION, EDITABLE)" + sqlKaigyo
      + sqlIndent + "VALUES ('" + codeTeigi.listName + "', '" + codeTeigi.descriptionHead
      + "', '" + codeTeigi.editable + "');" + sqlKaigyo;
    }
  }
  //console.log(sqlStr);
  return deleteLastStr(sqlStr, sqlKaigyo);
}

/**
 * コード定義からcodelkupテーブルのinsert文の作成
 * @param {Object} values code定義データリスト
 * @param {integer} lastRow 最終行数
 * @return {string} postgresqlのcode_listテーブルのinsert
 */
function getPostgreCodeLkupInsertSql(values, lastRow) {
  // 物理名を取得
  const tbEnName = "CODELKUP";
  //SQL文の作成
  let sqlStr = ""
  for (var j = 7; j <= lastRow; j++) {
    const codeTeigi = new CodeTeigi(values[j - 1]);
    const description = codeTeigi.descriptionHead + "-" + codeTeigi.description;

    sqlStr += sqlComment  + description + sqlKaigyo;
    sqlStr += "DELETE FROM " + tbEnName + " WHERE LIST_NAME = '" + codeTeigi.listName + "' AND CODE = '" + codeTeigi.code + "';" + sqlKaigyo;
    sqlStr += "INSERT INTO " + tbEnName 
    + " (LIST_NAME, CODE, DESCRIPTION, SHORT_VALUE, LONG_VALUE, EDITABLE, ACTIVE, SEQUENCE, UDF1, UDF2, UDF3, UDF4, UDF5, UDF6, UDF7, NOTE)"
    + sqlKaigyo + sqlIndent + "VALUES ('" + codeTeigi.listName + "', '" + codeTeigi.code + "', '" + description 
    + "', '" + codeTeigi.shortValue + "', '" + codeTeigi.longValue + "', '" + codeTeigi.editable + "', '" + codeTeigi.active 
    + "', '" + codeTeigi.sequence + "', '" + codeTeigi.udf1 + "', '" + codeTeigi.udf2 + "', '" + codeTeigi.udf3 + "', '" + codeTeigi.udf4
    + "', '" + codeTeigi.udf5 + "', '" + codeTeigi.udf6 + "', '" + codeTeigi.udf7 + "', '" + codeTeigi.note + "');" + sqlKaigyo;
  }
  //console.log(sqlStr);
  return deleteLastStr(sqlStr, sqlKaigyo);
}

/**
 * コード定義からjavaのenumの作成
 * @param {String} listName リストネーム
 * @param {String} description 説明
 * @param {Map} map key:code value:description
 * @return {string} postgresqlのcode_listテーブルのinsert
 */
function getCodeEnumJava(listName, description, map) {

  //import文の入れ物
  const importMap = new Map();
  //java
  let javaStr = "";
  //enumの作成
  //enumのパッケージの取得
  let javaStrHead = "package " + getProperty("java_enum_dbcode_package") + ";" + repeatConcatStr(javaKaigyo, 2);

  //固定impot文の挿入
  importMap.set("AllArgsConstructor", "lombok.AllArgsConstructor");
  importMap.set("Getter", "lombok.Getter");
  importMap.set("NonNull", "lombok.NonNull");

  const className = capitalize(toCamelCase(listName));

  //クラス名宣言
  let javaStrBody = getJavaDoc(listName + ":" + description + "のenumクラス") + "@AllArgsConstructor" + javaKaigyo
    + "@Getter" + javaKaigyo + "public enum " + className + " implements DbCode {" + repeatConcatStr(javaKaigyo, 2) 
    + javaIndent;
  
    //javadoc対象に引数(param)がある場合
  if (map) {
    // keysメソッドの戻り値(Iterator)を反復処理する
    for (const code of map.keys()) {
      javaStrBody += code.toUpperCase() + "(\"" + listName + "\", \"" + code  + "\", \"" + map.get(code) + "\")" 
      + javaKaigyo +  javaIndent + ", "
    }
  }

  //import文の入れ物
  const fieldMap = new Map();
  fieldMap.set("listName", "リストネーム");
  fieldMap.set("code", "コード");
  fieldMap.set("description", "説明");
  let javaField = "";
  let javaMethod = "";
  // keysメソッドの戻り値(Iterator)を反復処理する
  for (const field of fieldMap.keys()) {
    javaField += getJavaDoc(fieldMap.get(field) , 1) + javaIndent + "private final String " + field + ";" + repeatConcatStr(javaKaigyo, 2);
    const paramMap = new Map();
    paramMap.set(field, "テーブルや定数として指定している" + field);
    javaMethod += getJavaDoc(field + "値から適応するEnumを生成する" , 1, paramMap, field + "に一致するEnumクラス") 
    + javaIndent + "public static " + className + " " + field + "Of(@NonNull String " + field + ") {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return DbCode." + field + "Of(" + className + ".class, " + field + ");"
    + javaKaigyo + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2);
  }
  const javaStrFoot = javaField + deleteLastStr(javaMethod, javaKaigyo);
  javaStr = javaStrHead + getJavaImport(importMap) + deleteLastStr(javaStrBody, javaKaigyo +  javaIndent + ", ") 
  + ";" + repeatConcatStr(javaKaigyo, 2) + javaStrFoot + "}"

  return javaStr;
}