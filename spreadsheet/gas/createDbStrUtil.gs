/**
 * 共通変数
 */
//速度低下防止のため共通変数として設定シートの取得内容を外だし
const propertyValues = getPropertyValues();
//sqlコメント
const sqlComment = getProperty("sql_comment");
//sqlインデント
const sqlIndent = getProperty("sql_indent");
//改行コード
const sqlKaigyo = getProperty("sql_kaigyo");
//javaコメント
const javaComment = getProperty("java_comment");
const javaDockHead = "/**";
const javaDockBody = " * ";
const javaDcokFoot = " */";
const javaDockParam = "@param ";
const javaDockReturn = "@return ";
//javaインデント
const javaIndent = getProperty("java_indent");
//改行コード
const javaKaigyo = getProperty("java_kaigyo");
//YES
const yes = getProperty("yes");
//NO
const no = getProperty("no");

/**
 * DB定義1シート内を定義したentity
 */
class DbTeigi {

  /**
   * コンストラクター
   * nm No
   * coleEn カラム物理名
   * colja カラム名（日本語）
   * type データ型
   * digit 桁数
   * precision 精度
   * nullStr NULL許容かどうか
   * defaultStr 初期値
   * primary 主キー
   * unique ユニーク
   * serial シリアル
   * ind1 index1
   * ind2 index2
   * note 備考
   *
   * @param {string[]} record DB定義1シート内1行（配列）
   */
  constructor(record) {
    [this.nm, this.colen, this.colja, this.type, this.digit
      , this.precision, this.nullStr, this.defaultStr, this.primary, this.unique
      , this.serial, this.ind1, this.ind2, this.note] = record;
  }
}

/**
 * コード定義1シート内を定義したentity
 */
class CodeTeigi {

  /**
   * コンストラクター
   * descriptionHead 親説明
   * description 説明
   * listName リストネーム
   * code コード
   * shortValue 値(短)
   * longValue 値(長)
   * editable 編集可否
   * active 有効化フラグ
   * sequence シークエンス
   * udf1 備考(なんでも)1
   * udf2 備考(なんでも)2
   * udf3 備考(なんでも)3
   * udf4 備考(なんでも)4
   * udf5 備考(なんでも)5
   * udf6 備考(なんでも)6
   * udf7 備考(なんでも)7
   * note メモ
   *
   * @param {string[]} record DB定義1シート内1行（配列）
   */
  constructor(record) {
    [this.descriptionHead, this.description, this.listName, this.code, this.shortValue
    , this.longValue, this.editable, this.active, this.sequence, this.udf1, this.udf2
    , this.udf3, this.udf4, this.udf5, this.udf6, this.udf7, this.note] = record;
  }
}


/**
 * ファイル書き出し
 * @param {string} fileName ファイル名
 * @param {string} content ファイルの内容
 * @param {string} faldaName フォルダID
 */
function createFile(fileName, content, faldaID) {
  const folder = DriveApp.getFolderById(faldaID);
  const contentType = 'text/plain';
  const charset = 'utf-8';

  // Blob を作成する
  const blob = Utilities.newBlob('', contentType, fileName)
    .setDataFromString(content, charset);

  //DriveAppクラスからファイル名でファイル(ファイル名一致した分)を取得する
  const filesData = folder.getFilesByName(fileName);
  //next()でファイルを取得し、ゴミ箱のフラグをtrueにする（同名ファイルをすべて削除）
  while (filesData.hasNext()) {
    filesData.next().setTrashed(true);
  }

  // ファイルを保存
  folder.createFile(blob);
}

/**
 * 設定シート内に定義してある全情報の取得
 * @return {string[]} 設定シート内に定義してある全情報
 */
function getPropertyValues() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('設定');
  const r = sheet.getLastRow();
  const c = sheet.getLastColumn();
  return sheet.getRange(1, 1, r, c).getValues();
}

/**
 * 設定シート内に定義している情報の取得
 * 速度低下防止のため共通変数としてプロパティシートの取得内容を外だし（共通変数）
 * @param {string} key 設定名
 * @return {string} 設定値
 */
function getProperty(key) {
  for (let i = 0; i < propertyValues.length; i++) {
    if (key == propertyValues[i][0]) {
      //console.log(propertyValues[i][1]);
      return propertyValues[i][1];
    }
  }
  //見つからないときはエラーにしたほうが良いかも…とりあえず固定文字列返却
  return "設定に追加してください";
}

/**
 * スネークケースからキャメルケースに変換（文字列）
 * @param {string} str スネークケース
 * @return {string} キャメルケース
 */
function toCamelCase(str) {
  return str.split('_').map(function (word, index) {
    if (index === 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}

/**
 * 先頭1文字を大文字に変換
 * @param {string} str 文字列
 * @return {string} 先頭1文字を大文字に変換した文字列
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 文字列を指定した回数文結合して返却
 * @param {string} str 文字列
 * @param {int} nm 文字列を何回つけるか
 * @return 結合した文字列
 */
function repeatConcatStr(str, nm) {
  let buf = "";
  for (let j = 0; j < nm; j++) {
    buf += str;
  }
  return buf;
}

/**
 * str内に登場する最後の「lastStr」だけを削除
 * @param {string} str 文字列
 * @param {string} lastStr 削除対象文字列
 * @return 削除完了した文字列
 */
function deleteLastStr(str, lastStr) {
  const deleteIndex = str.lastIndexOf(lastStr);
  return str.slice(0, deleteIndex) + str.slice(deleteIndex + lastStr.length, str.length);
}

/**
 * mapを第二引数のmapを優先(かぶったら上書き)して結合する
 * @param {map} map マップ
 * @param {map} prioritizeMap マップ キーが被った場合こちらが優先される
 * @return 結合したmap
 */
function concatMap(map, prioritizeMap) {
  if (prioritizeMap) {
    // keysメソッドの戻り値(Iterator)を反復処理する
    for (const key of prioritizeMap.keys()) {
      if (prioritizeMap.get(key)) {
        map.set(key, prioritizeMap.get(key));
      }
    }
  }
  return map;
}

/**
 * 文字列の中から対象文字列を切り抜き
 * @param {string} str 文字列
 * @param {string} startStr 開始
 * @param {string} lastStr 終了
 * @return 切り抜いた文字列
 */
function substringBetweenStr(str, startStr, lastStr) {
  const startIndex = str.indexOf(startStr) > 0 ? str.indexOf(startStr) + startStr.length : 0;
  const lastIndex = str.lastIndexOf(lastStr) > 0 ? str.lastIndexOf(lastStr) : str.length;
  return str.substring(startIndex, lastIndex);
}

/**
 * 0埋めを行う
 * @param {integer} num 値
 * @param {integer} len 桁数
 * @return 0埋めした文字列
 */
// num=値 len=桁数
function zeroPadding(num, len){
	return ( Array(len).join('0') + num ).slice( -len );
}










