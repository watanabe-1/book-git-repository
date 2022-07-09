//共通変数、共通関数、共通クラスはcreateDbStrUtil.gsに定義
//gasではプロジェクト内のファイルらは実行時？（jsへコンパイル時？）にすべて一つのファイルとして扱われるためimportは必要ないらしい
//APIを呼ぶ場合とても時間がかかる。例えばSpreadsheetからデータを取得したり、更新したり。
//なので基本的には1度にシートの中身をすべて取得しちゃうのがいい。
//更新も同じで1度にすべて更新したほうが良い。

/**
 * 呼び出し元シートに定義してあるすべてのテーブルのjavaのentityを作成
 */
function createJavaEntityAll() {
  //テーブル一覧シートを取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("テーブル一覧");
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();

  //メイン処理
  for (var j = 3; j <= lastRow; j++) {
    //console.log(values[j-1][0]);
    //console.log(SpreadsheetApp.getActiveSheet().getName());
    //シートのアクティブ化
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(values[j - 1][0]).activate();
    //entityの作成
    createJavaEntity();
    //console.log(SpreadsheetApp.getActiveSheet().getName());
  }
  //一覧シートを開いている状態に戻す
  sheet.activate();
  //console.log(SpreadsheetApp.getActiveSheet().getName());
}

/**
 * 呼び出し元シートに定義してあるテーブルのjavaのentityを作成
 */
function createJavaEntity() {
  //アクティブシートを取得
  const sheet = SpreadsheetApp.getActiveSheet();
  //アクティブシート名を取得
  const sheetName = sheet.getName();
  // entity備考を取得
  const entityName = sheet.getRange(3, 3).getValue();
  //出力ファイル名
  const fileName = entityName + ".java";
  //出力フォルダ
  const faldaID = getProperty("java_entity_dir");

  let content = "";
  //メイン処理
  //シート名を引数に渡し、entityの作成
  content += getJavaEntity(sheetName) + repeatConcatStr(javaKaigyo, 2);

  //ファイルを作成し出力
  createFile(fileName, content, faldaID);
}

/**
 * 呼び出し元シートに定義してあるすべてのテーブルのjavaのdbMapperを作成
 */
function createJavaMapperAll() {
  //テーブル一覧シートを取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("テーブル一覧");
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();

  //メイン処理
  for (var j = 3; j <= lastRow; j++) {
    //シートのアクティブ化
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(values[j - 1][0]).activate();
    //mapperの作成
    createJavaMapper();
  }
  //一覧シートを開いている状態に戻す
  sheet.activate();
}

/**
 * 呼び出し元シートに定義してあるテーブルのjavaのdbMapperを作成
 */
function createJavaMapper() {
  //メイン処理
  //mapper(xml)作成
  createJavaMapperXml();
  //mapper(java)作成
  createJavaMapperJava();
  //javaのdbMapper(java)よ呼び出すservice
  createJavaService();
}

/**
 * 呼び出し元シートに定義してあるテーブルのjavaのdbMapper(xml)を作成
 */
function createJavaMapperXml() {
  //アクティブシートを取得
  const sheet = SpreadsheetApp.getActiveSheet();
  //アクティブシート名を取得
  const sheetName = sheet.getName();
  // entity備考を取得
  const entityName = sheet.getRange(3, 3).getValue();
  //出力ファイル名
  const fileName = entityName.toLowerCase() + ".xml";
  //出力フォルダ
  const faldaID = getProperty("java_mapper_xml_dir");

  let content = "";
  //メイン処理
  //シート名を引数に渡し、dbMapper(xml)の作成
  content += getJavaMapperXml(sheetName) + repeatConcatStr(javaKaigyo, 2);

  //ファイルを作成し出力
  createFile(fileName, content, faldaID);
}

/**
 * 呼び出し元シートに定義してあるテーブルのjavaのdbMapper(java)を作成
 */
function createJavaMapperJava() {
  //アクティブシートを取得
  const sheet = SpreadsheetApp.getActiveSheet();
  //アクティブシート名を取得
  const sheetName = sheet.getName();
  // entity備考を取得
  const entityName = sheet.getRange(3, 3).getValue();
  //出力ファイル名
  const fileName = entityName + "Mapper.java";
  //出力フォルダ
  const faldaID = getProperty("java_mapper_java_dir");

  let content = "";
  //メイン処理
  //シート名を引数に渡し、dbMapper(java))の作成
  content += getJavaMapperJava(sheetName) + repeatConcatStr(javaKaigyo, 2);

  //ファイルを作成し出力
  createFile(fileName, content, faldaID);
}

/**
 * 呼び出し元シートに定義してあるテーブルのjavaのdbMapper(java)よ呼び出すserviceを作成
 */
function createJavaService() {
  //アクティブシートを取得
  const sheet = SpreadsheetApp.getActiveSheet();
  //アクティブシート名を取得
  const sheetName = sheet.getName();
  // entity備考を取得
  const entityName = sheet.getRange(3, 3).getValue();
  //出力ファイル名
  const fileName = entityName + "Service.java";
  //出力フォルダ
  const faldaID = getProperty("java_service_dir");

  let content = "";
  //メイン処理
  //シート名を引数に渡し、dbMapper(java))の作成
  content += getJavaService(sheetName) + repeatConcatStr(javaKaigyo, 2);

  //ファイルを作成し出力
  createFile(fileName, content, faldaID);
}

/**
 * 引数で指定したテーブルのjavaのentityを作成
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} javaのentityクラス
 */
function getJavaEntity(sheetName) {
  //sheetName = "カテゴリー";
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
  // entity名を取得
  const entityName = values[2][2];
  // テーブル備考を取得
  const tbNote = values[2][3];
  //import文の入れ物
  const importMap = new Map();
  //java
  let javaStr = "";

  //entityの作成
  //entityのパッケージの取得
  let javaStrHead = "package " + getProperty("java_entity_package") + ";" + repeatConcatStr(javaKaigyo, 2);

  //固定impot文の挿入
  importMap.set("Serializable", "java.io.Serializable");

  //クラス名宣言
  let javaStrBody = getJavaDoc(tbEnName + ":" + tbJaName + "(" + tbNote + ")のentityクラス") + getProperty("java_entity_lombok")
    + javaKaigyo + "public class " + entityName + " implements Serializable {" + repeatConcatStr(javaKaigyo, 2);
  //フィールド宣言
  for (var j = 5; j <= lastRow; j++) {
    const dbTeigi = new DbTeigi(values[j - 1]);
    //javaDoc説明文
    let allNote = "";
    //import文
    const importStr = getJavaClassOrImport(dbTeigi.type);
    //import文
    const classStr = getJavaClass(importStr);
    //import文の時かつまだセットしたことがない時だけmapにセット
    if (1 < importStr.split(".").length && !importMap.has(classStr)) {
      importMap.set(classStr, importStr);
    }
    //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
    //カラム物理名、データ型
    if (dbTeigi.colen) {
      //カラム物理名（日本語）
      if (dbTeigi.colja) {
        allNote += dbTeigi.colja;
      }
      //備考
      if (dbTeigi.note) {
        allNote += "(" + dbTeigi.note + ")";
      }
      javaStrBody += getJavaDoc(allNote, 1);
      javaStrBody += javaIndent + "private " + classStr + " " + toCamelCase(dbTeigi.colen) + ";" + repeatConcatStr(javaKaigyo, 2);
    }
  }

  javaStrHead += getJavaImport(importMap) + "import " + getProperty("java_import_entity_lombok")
    + ";" + repeatConcatStr(javaKaigyo, 2);
  javaStrBody += "}";
  javaStr = javaStrHead + javaStrBody;
  //console.log(javaStr);
  return javaStr;
}

/**
 * 引数で指定したテーブルのdbMapper(xml)を作成
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} dbMapper(xml)
 */
function getJavaMapperXml(sheetName) {
  // シート名を指定してシートを取得
  const sheet = SpreadsheetApp.
    getActiveSpreadsheet().getSheetByName(sheetName);
  //最終行数を取得
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  //シート内のカラム全取得
  const values = sheet.getDataRange().getValues();
  // 物理名を取得
  const tbEnName = values[2][1];
  // entity名を取得
  const entityName = values[2][2];
  // entityItem名(先頭2文字)
  const entityItemName = entityName.toLowerCase().slice(0, 3);
  //from
  const fromStr = "from " + tbEnName;
  //where
  let whereStr = "where ";
  //where
  let updateWhereStr = "where ";
  //order by
  let orderbyStr = "order by ";
  //select head
  const selectHeadStr = javaIndent + "<select id=\"";
  //select body
  const selectBodyStr = "\" resultType=\"" + getProperty("java_entity_package")
    + "." + entityName + "\">" + javaKaigyo + repeatConcatStr(javaIndent, 2) + "select ";
  //select foot
  const selectFootStr = javaIndent + "</select>" + javaKaigyo;
  //selectカラム
  let slectColStr = "";
  //insert head
  const insertHeadStr = javaIndent + "<insert id=\"";
  //insert body
  const insertBodyStr = "\">" + javaKaigyo + repeatConcatStr(javaIndent, 2) + "insert into " + tbEnName + " (";
  //insert foot
  const insertFootStr = javaIndent + "</insert>" + javaKaigyo;
  //insert values
  let insertValueStr = "";
  //insert values
  let insertBulkValueStr = "";
  //insertカラム
  let insertColStr = "";
  //update head
  const updateHeadStr = javaIndent + "<update id=\"";
  //update body
  const updateBodyStr = "\">" + javaKaigyo + repeatConcatStr(javaIndent, 2) + "update " + tbEnName + " set ";
  //update foot
  const updateFootStr = javaIndent + "</update>" + javaKaigyo;
  //update カラム
  let updateColAndValueStr = "";
  //updateAll カラム
  let updateAllColAndValueStr = "";
  //delete head
  const deleteHeadStr = javaIndent + "<delete id=\"";
  //delete body
  const deleteBodyStr = "\">" + javaKaigyo + repeatConcatStr(javaIndent, 2) + "delete ";
  //delete foot
  const deleteFootStr = javaIndent + "</delete>" + javaKaigyo;

  //フィールド宣言
  for (var j = 5; j <= lastRow; j++) {
    const dbTeigi = new DbTeigi(values[j - 1]);
    //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
    //カラム物理名、データ型
    if (dbTeigi.colen) {
      //{#カラム名キャメルケース}
      const camelCaseColStr = "#{" + toCamelCase(dbTeigi.colen) + "}";
      //{#カラム名キャメルケース update}
      const updateCamelCaseColStr = "#{" + toCamelCase(dbTeigi.colen) + "Where}";
      //selectカラム
      slectColStr += dbTeigi.colen + ", ";
      //insert and update 対象カラム
      if (dbTeigi.serial && dbTeigi.serial == no) {
        insertColStr += dbTeigi.colen + ", ";
        insertValueStr += camelCaseColStr + ", ";
        insertBulkValueStr += "#{" + entityItemName + "." + toCamelCase(dbTeigi.colen) + "}, ";
        // update文対象カラムのみ
        if (!isIgnoreColOfUpdate(dbTeigi.colen)) {
          updateColAndValueStr += dbTeigi.colen + " = #{" + entityItemName + "." + toCamelCase(dbTeigi.colen) + "}, ";
          updateAllColAndValueStr += dbTeigi.colen + " = " + camelCaseColStr + ", ";
        }
      }
      //where and orde by
      if (dbTeigi.primary && dbTeigi.primary == yes) {
        whereStr += dbTeigi.colen + " = " + camelCaseColStr + " AND ";
        orderbyStr += dbTeigi.colen + ", ";
        updateWhereStr += dbTeigi.colen + " = " + updateCamelCaseColStr + " AND ";
      }
    }
  }
  //最後に付け加えた「, 」だけを削除
  slectColStr = deleteLastStr(slectColStr, ", ");
  insertColStr = deleteLastStr(insertColStr, ", ");
  insertValueStr = deleteLastStr(insertValueStr, ", ");
  insertBulkValueStr = deleteLastStr(insertBulkValueStr, ", ");
  updateColAndValueStr = deleteLastStr(updateColAndValueStr, ", ");
  updateAllColAndValueStr = deleteLastStr(updateAllColAndValueStr, ", ");
  orderbyStr = deleteLastStr(orderbyStr, ", ");
  //最後に付け加えた「AND 」だけを削除
  whereStr = deleteLastStr(whereStr, " AND ");
  //最後に付け加えた「AND 」だけを削除
  updateWhereStr = deleteLastStr(updateWhereStr, " AND ");

  //selectAll
  const selectAllStr = selectHeadStr + "findAll" + selectBodyStr + slectColStr + " " + fromStr
    + javaKaigyo + repeatConcatStr(javaIndent, 3) + orderbyStr + javaKaigyo + selectFootStr;
  //selectOne
  const selectOneStr = selectHeadStr + "findOne" + selectBodyStr + slectColStr + " " + fromStr
    + javaKaigyo + repeatConcatStr(javaIndent, 3) + whereStr + javaKaigyo + selectFootStr;
  //insertBulk
  const insertBulkStr = insertHeadStr + "saveBulk" + "\" parameterType=\"java.util.List" + insertBodyStr + insertColStr + ") values"
    + javaKaigyo + repeatConcatStr(javaIndent, 2) + "<foreach collection=\"" + entityItemName
    + "List\" item=\"" + entityItemName + "\" separator=\",\"> " + javaKaigyo + repeatConcatStr(javaIndent, 3)
    + "(" + insertBulkValueStr + ")" + javaKaigyo + repeatConcatStr(javaIndent, 2)
    + "</foreach>" + javaKaigyo + insertFootStr;
  //insertOne
  const insertOneStr = insertHeadStr + "saveOne" + insertBodyStr + insertColStr + ")"
    + javaKaigyo + repeatConcatStr(javaIndent, 3) + "values (" + insertValueStr + ")" + javaKaigyo + insertFootStr;
  //updateAll
  const updateAllStr = updateHeadStr + "updateAll" + updateBodyStr + updateAllColAndValueStr + javaKaigyo + updateFootStr;
  //updateOne
  const updateOneStr = updateHeadStr + "updateOne" + updateBodyStr + updateColAndValueStr
    + javaKaigyo + repeatConcatStr(javaIndent, 3) + updateWhereStr + javaKaigyo + updateFootStr;
  //deleteAll
  const deleteAllStr = deleteHeadStr + "deleteAll" + deleteBodyStr + fromStr + javaKaigyo + deleteFootStr;
  //deleteOne
  const deleteOneStr = deleteHeadStr + "deleteOne" + deleteBodyStr + fromStr
    + javaKaigyo + repeatConcatStr(javaIndent, 3) + whereStr + javaKaigyo + deleteFootStr;

  //mapperの作成
  const xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" + javaKaigyo
    + "<!DOCTYPE mapper PUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\" \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">" + javaKaigyo
    + "<mapper namespace=\"" + getProperty("java_mapper_package") + "." + entityName + "Mapper\">" + javaKaigyo
    + selectAllStr + selectOneStr + insertBulkStr + insertOneStr + updateAllStr
    + updateOneStr + deleteAllStr + deleteOneStr + "</mapper>";
  //console.log(xmlStr);
  return xmlStr;
}

/**
 * 引数で指定したテーブルのdbMapper(java)を作成
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} dbMapper(java)
 */
function getJavaMapperJava(sheetName) {
  //sheetName = "カテゴリー";
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
  // entity名を取得
  const entityName = values[2][2];
  // entityItem名(先頭2文字)
  const entityItemName = entityName.toLowerCase().slice(0, 3);
  // テーブル備考を取得
  const tbNote = values[2][3];
  //import文の入れ物
  const importMap = new Map();
  //import文の入れ物2
  const importMap2 = new Map();
  //primarykey(java)
  let primaryKeyJavaClassVarStr = "";
  //primarykey(java update)
  let updatePrimaryKeyJavaClassVarStr = "";
  //primarykey(db)
  const primaryKeyColMap = new Map();
  //List<entyti>用マップ
  const entityListMap = new Map();
  //entyti用マップ
  const entityMap = new Map();

  //フィールド宣言
  for (var j = 5; j <= lastRow; j++) {
    const dbTeigi = new DbTeigi(values[j - 1]);
    //javaDoc説明文
    let note = "";
    //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
    //カラム物理名、データ型
    if (dbTeigi.colen) {
      //プライマルキー
      if (dbTeigi.primary && dbTeigi.primary == yes) {
        //キャメルケースカラム名
        const camelCaseColStr = toCamelCase(dbTeigi.colen);
        //import文
        const importStr = getJavaClassOrImport(dbTeigi.type);
        //import文
        const classStr = getJavaClass(importStr);
        //import文の時かつまだセットしたことがない時だけmapにセット
        if (1 < importStr.split(".").length && !importMap.has(classStr)) {
          importMap.set(classStr, importStr);
        }
        //カラム物理名（英語）
        note += dbTeigi.colen;
        //カラム物理名（日本語）
        if (dbTeigi.colja) {
          note += "(" + dbTeigi.colja;
          //備考
          if (dbTeigi.note) {
            note += "--" + dbTeigi.note;
          }
          note += ")";
        }
        //javaDock用mapに値をset
        primaryKeyColMap.set(camelCaseColStr, note);
        //プライマルキー
        primaryKeyJavaClassVarStr += "@Param(\"" + camelCaseColStr + "\")" + classStr + " " + camelCaseColStr + ", ";
        updatePrimaryKeyJavaClassVarStr += "@Param(\"" + camelCaseColStr + "Where\")" + classStr + " " + camelCaseColStr + ", ";
      }
    }
  }
  //最後に付け加えた「, 」だけを削除
  primaryKeyJavaClassVarStr = deleteLastStr(primaryKeyJavaClassVarStr, ", ");
  updatePrimaryKeyJavaClassVarStr = deleteLastStr(updatePrimaryKeyJavaClassVarStr, ", ");
  //固定import文1、２のセット
  importMap.set("LIST", "java.util.List");
  importMap2.set("Mapper", "org.apache.ibatis.annotations.Mapper");
  importMap2.set("Service", "org.apache.ibatis.annotations.Param");
  importMap2.set(entityName, getProperty("java_entity_package") + "." + entityName);
  //javaDock用mapに値をset
  entityListMap.set(entityItemName + "List", "entity(" + entityName + ")のList");
  entityMap.set(entityItemName, "entity(" + entityName + ")");

  //dbMapper(java)の作成
  const javaStr = "package " + getProperty("java_mapper_package") + ";" + repeatConcatStr(javaKaigyo, 2)
    //使用するクラスに合わせたimport文
    + getJavaImport(importMap) + getJavaImport(importMap2)
    //クラス宣言
    + javaKaigyo + getJavaDoc(tbEnName + ":" + tbJaName + "(" + tbNote + ")のmapperクラス") + "@Mapper" + javaKaigyo
    + "public interface " + entityName + "Mapper {" + repeatConcatStr(javaKaigyo, 2)
    //findAll
    + getJavaDoc("全検索", 1, "", "検索結果(複数行)")
    + javaIndent + "List<" + entityName + "> findAll();" + repeatConcatStr(javaKaigyo, 2)
    //findOne
    + getJavaDoc("1行検索(引数にプライマルキーを指定)", 1, primaryKeyColMap, "検索結果(1行)")
    + javaIndent + entityName + " findOne(" + primaryKeyJavaClassVarStr + ");" + repeatConcatStr(javaKaigyo, 2)
    //saveBulk
    + getJavaDoc("複数行insert", 1, entityListMap, "insert行数")
    + javaIndent + "int saveBulk(@Param(\"" + entityItemName + "List" + "\")List<" + entityName + "> "
    + entityItemName + "List" + ");" + repeatConcatStr(javaKaigyo, 2)
    //saveOne
    + getJavaDoc("1行insert", 1, entityMap, "insert行数")
    + javaIndent + "int saveOne(" + entityName + " " + entityItemName + ");" + repeatConcatStr(javaKaigyo, 2)
    //updateAll
    + getJavaDoc("全行update", 1, entityMap, "update行数")
    + javaIndent + "int updateAll(" + entityName + " " + entityItemName + ");" + repeatConcatStr(javaKaigyo, 2)
    //updateOne
    + getJavaDoc("1行update" + javaKaigyo
      + "プライマルキーをWhere句に指定" + javaKaigyo + "プライマルキー：" + updatePrimaryKeyJavaClassVarStr, 1,
      concatMap(entityMap, primaryKeyColMap), "update行数")
    + javaIndent + "int updateOne(@Param(\"" + entityItemName + "\") " + entityName + " " + entityItemName + ", " + updatePrimaryKeyJavaClassVarStr + ");"
    + repeatConcatStr(javaKaigyo, 2)
    //deleteAll
    + getJavaDoc("全行delete", 1, "", "delete行数")
    + javaIndent + "int deleteAll();" + repeatConcatStr(javaKaigyo, 2)
    //deleteOne
    + getJavaDoc("1行delete(引数にプライマルキーを指定)", 1, primaryKeyColMap, "delete行数")
    + javaIndent + "int deleteOne(" + primaryKeyJavaClassVarStr + ");" + repeatConcatStr(javaKaigyo, 2)
    + "}";

  //console.log(javaStr);
  return javaStr;
}

/**
 * 引数で指定したテーブルのdbMapper(java)を呼び出すserviceを作成
 * @param {string} sheetName シート名（対象テーブル名(日本語)）
 * @return {string} service
 */
function getJavaService(sheetName) {
  //sheetName = "カテゴリー";
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
  // entity名を取得
  const entityName = values[2][2];
  // entityItem名(先頭2文字)
  const entityItemName = entityName.toLowerCase().slice(0, 3);
  // テーブル備考を取得
  const tbNote = values[2][3];
  //import文の入れ物
  const importMap = new Map();
  //import文の入れ物2
  const importMap2 = new Map();
  const varMapperName = entityName.toLowerCase() + "Mapper";
  //primarykey(javaClass var)
  let primaryKeyJavaClassVarStr = "";
  //primarykey(java var)
  let primaryKeyJavaVarStr = "";
  //primarykey(db)
  const primaryKeyColMap = new Map();
  //List<entyti>用マップ
  const entityListMap = new Map();
  //entyti用マップ
  const entityMap = new Map();

  //フィールド宣言
  for (var j = 5; j <= lastRow; j++) {
    const dbTeigi = new DbTeigi(values[j - 1]);
    //javaDoc説明文
    let note = "";
    //jsはifの条件に変数を入れたとき、勝手にnullもしくは空文字ならfalse、それ以外ならtrueと判定してくれるみたい
    //カラム物理名、データ型
    if (dbTeigi.colen) {
      //プライマルキー
      if (dbTeigi.primary && dbTeigi.primary == yes) {
        //キャメルケースカラム名
        const camelCaseColStr = toCamelCase(dbTeigi.colen);
        //import文
        const importStr = getJavaClassOrImport(dbTeigi.type);
        //import文
        const classStr = getJavaClass(importStr);
        //import文の時かつまだセットしたことがない時だけmapにセット
        if (1 < importStr.split(".").length && !importMap.has(classStr)) {
          importMap.set(classStr, importStr);
        }
        //カラム物理名（英語）
        note += dbTeigi.colen;
        //カラム物理名（日本語）
        if (dbTeigi.colja) {
          note += "(" + dbTeigi.colja;
          //備考
          if (dbTeigi.note) {
            note += "--" + dbTeigi.note;
          }
          note += ")";
        }
        //javaDock用mapに値をset
        primaryKeyColMap.set(camelCaseColStr, note);
        //プライマルキー
        primaryKeyJavaClassVarStr += classStr + " " + camelCaseColStr + ", ";
        primaryKeyJavaVarStr += camelCaseColStr + ", ";
      }
    }
  }
  //最後に付け加えた「, 」だけを削除
  primaryKeyJavaClassVarStr = deleteLastStr(primaryKeyJavaClassVarStr, ", ");
  primaryKeyJavaVarStr = deleteLastStr(primaryKeyJavaVarStr, ", ");
  //固定import文1、2のセット
  importMap.set("List<>", "java.util.List");
  importMap2.set("Autowired", "org.springframework.beans.factory.annotation.Autowired");
  importMap2.set("Service", "org.springframework.stereotype.Service");
  importMap2.set("Transactional", "org.springframework.transaction.annotation.Transactional");
  importMap2.set(entityName, getProperty("java_entity_package") + "." + entityName);
  importMap2.set(entityName + "Mapper", getProperty("java_mapper_package") + "." + entityName + "Mapper");
  //javaDock用mapに値をset
  entityListMap.set(entityItemName + "List", "entity(" + entityName + ")のList");
  entityMap.set(entityItemName, "entity(" + entityName + ")");

  //dbMapper(java)の作成
  const javaStr = "package " + getProperty("java_service_package") + ";" + repeatConcatStr(javaKaigyo, 2)
    //使用するクラスに合わせたimport文1、2
    + getJavaImport(importMap) + getJavaImport(importMap2)
    //クラス宣言
    + getJavaDoc(tbEnName + ":" + tbJaName + "(" + tbNote + ")のserviceクラス") + "@Service" + javaKaigyo
    + "public class " + entityName + "Service {" + repeatConcatStr(javaKaigyo, 2)
    //mappperクラスをDI
    + javaIndent + "@Autowired" + javaKaigyo
    + javaIndent + "private " + entityName + "Mapper" + " " + varMapperName + ";" + repeatConcatStr(javaKaigyo, 2)
    //findAll
    + getJavaDoc("全検索", 1, "", "検索結果(複数行)")
    + javaIndent + "public List<" + entityName + "> findAll() {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".findAll();" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    //findOne
    + getJavaDoc("1行検索(引数にプライマルキーを指定)", 1, primaryKeyColMap, "検索結果(1行)")
    + javaIndent + "public " + entityName + " findOne(" + primaryKeyJavaClassVarStr + ") {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".findOne(" + primaryKeyJavaVarStr + ");" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    //saveBulk
    + getJavaDoc("複数行insert", 1, entityListMap, "insert行数")
    + javaIndent + "@Transactional" + javaKaigyo
    + javaIndent + "public int saveBulk(List<" + entityName + "> "
    + entityItemName + "List" + ") {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".saveBulk(" + entityItemName + "List" + ");" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    //saveOne
    + getJavaDoc("1行insert", 1, entityMap, "insert行数")
    + javaIndent + "@Transactional" + javaKaigyo
    + javaIndent + "public int saveOne(" + entityName + " " + entityItemName + ") {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".saveOne(" + entityItemName + ");" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    //updateAll
    + getJavaDoc("全行update", 1, entityMap, "update行数")
    + javaIndent + "@Transactional" + javaKaigyo
    + javaIndent + "public int updateAll(" + entityName + " " + entityItemName + ") {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".updateAll(" + entityItemName + ");" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    //updateOne
    + getJavaDoc("1行update" + javaKaigyo
      + "プライマルキーをWhere句に指定" + javaKaigyo + "プライマルキー：" + primaryKeyJavaClassVarStr, 1,
      concatMap(entityMap, primaryKeyColMap), "update行数")
    + javaIndent + "@Transactional" + javaKaigyo
    + javaIndent + "public int updateOne(" + entityName + " " + entityItemName + ", " + primaryKeyJavaClassVarStr + ") {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".updateOne(" + entityItemName + ", " + primaryKeyJavaVarStr + ");" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    //deleteAll
    + getJavaDoc("全行delete", 1, "", "delete行数")
    + javaIndent + "@Transactional" + javaKaigyo
    + javaIndent + "public int deleteAll() {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".deleteAll();" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    //deleteOne
    + getJavaDoc("1行delete(引数にプライマルキーを指定)", 1, primaryKeyColMap, "delete行数")
    + javaIndent + "@Transactional" + javaKaigyo
    + javaIndent + "public int deleteOne(" + primaryKeyJavaClassVarStr + ") {" + javaKaigyo
    + repeatConcatStr(javaIndent, 2) + "return " + varMapperName + ".deleteOne(" + primaryKeyJavaVarStr + ");" + javaKaigyo
    + javaIndent + "}" + repeatConcatStr(javaKaigyo, 2)
    + "}";

  //console.log(javaStr);
  return javaStr;
}

/**
 * javadocを取得
 * @param {string} allNote 説明文 改行済みOK 絶対必要
 * @param {int} indentNm インデントを何回つけるか なくてもよい 初期値は 0
 * @param {map<String, String>} paramNoteMap key:変数名 item:変数の説明 なくてもよい
 * @param {string} returnNote 戻り値の説明 なくてもよい
 * @return {string} javadock
 */
function getJavaDoc(allNote, indentNm = 0, paramNoteMap = "", returnNote = "") {
  const indent = repeatConcatStr(javaIndent, indentNm);
  const note = allNote.split(javaKaigyo);
  let javaDock = indent + javaDockHead + javaKaigyo;
  for (let i = 0; i < note.length; i++) {
    javaDock += indent + javaDockBody + note[i] + javaKaigyo;
  }
  //javadoc対象に引数(param)がある場合
  if (paramNoteMap) {
    // keysメソッドの戻り値(Iterator)を反復処理する
    for (const varName of paramNoteMap.keys()) {
      if (paramNoteMap.get(varName)) {
        javaDock += indent + javaDockBody + javaDockParam + varName + " " + paramNoteMap.get(varName) + javaKaigyo;
      }
    }
  }
  //javadoc対象に戻り値(return)がある場合
  if (returnNote) {
    javaDock += indent + javaDockBody + javaDockReturn + returnNote + javaKaigyo
  }
  javaDock += indent + javaDcokFoot + javaKaigyo
  return javaDock;
}

/**
 * update文の除外対象カラムか判定
 * @param {string} col 判定対象カラム
 * @return {boolean} 判定結果
 */
function isIgnoreColOfUpdate(col) {
  return getProperty('java_mapper_xml_update_ignore_col').split(",").map(v => v.toUpperCase()).includes(col.toUpperCase());
}

/**
 * sqlのカラムの型に合わせてjavaのclassのimport対象文もしくはclassを取得
 * @param {string} sqlColType sqlのカラムの型
 * @return {string} javaのclassのimport文もしくはclass
 */
function getJavaClassOrImport(sqlColType) {
  const upperSqlColType = sqlColType.toUpperCase();
  let ret = "";
  switch (upperSqlColType) {
    //SERIAL
    case "SERIAL":
      //とりあえず仮で
      ret = "String";
      break;
    //INTEGER
    case "INTEGER":
      ret = "Integer";
      break;
    //DECIMAL
    case "DECIMAL":
      ret = getProperty("java_import_decimal_class");
      break;
    //NUMERIC
    case "NUMERIC":
      ret = getProperty("java_import_decimal_class");
      break;
    //BOOLEAN
    case "BOOLEAN":
      ret = "boolean";
      break;
    //TIMESTAMP
    case "TIMESTAMP":
      ret = getProperty("java_import_date_class");
      break;
    //VARCHAR
    case "VARCHAR":
      ret = "String";
      break;
    //上記以外（その他）
    default:
      ret = "String";
  }
  return ret;
}
/**
 * import文からClassを取得
 * @param {string} importStr javaのimport対象文もしくはCLASS
 * @return {string} javaのclass
 */
function getJavaClass(importStr) {
  const buf = importStr.split(".");
  return buf[buf.length - 1];
}

/**
 * import文が格納されたmapの中身を結合
 * @param {map} importMap javaのimport対象文が格納されたmap
 * @return {string} javaのclass import文が0の場合は""を返却
 */
function getJavaImport(importMap) {
  let buf = "";
  let cnt = 0;
  // keysメソッドの戻り値(Iterator)を反復処理する
  for (const key of importMap.keys()) {
    if (importMap.get(key)) {
      buf += "import " + importMap.get(key) + ";" + javaKaigyo
      cnt++;
    }
  }
  if (cnt == 0) {
    return "";
  } else {
    return buf + javaKaigyo;
  }
}



