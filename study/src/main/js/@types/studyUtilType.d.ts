/**
 * 祝日一覧用
 */
type Syukujits = {
  date: Date;
  name: string;
};

/**
 * 画像パス
 */
export type Image = {
  serialKey: string;
  imgId: string;
  imgType: string;
  imgPath: string;
  imgName: string;
  note: string;
  insDate: Date;
  insUser: String;
  updDate: Date;
  updUser: String;
  catIcon: any;
  imgIds: Image;
};

/**
 * カテゴリー
 */
export type Category = {
  serialKey: string;
  catCode: string;
  catName: string;
  catType: string;
  note: string;
  imgType: string;
  imgId: string;
  active: string;
  insDate: Date;
  insUser: String;
  updDate: Date;
  updUser: String;
  catIcon: any;
  imgIds: Image;
  delete: string;
};

/**
 * カテゴリーリスト
 */
export type CategoryFormList = {
  catDataList: Category[];
};

/**
 * 家計簿
 */
export type Books = {
  serialKey: string;
  booksId: string;
  userId: string;
  booksType: string;
  booksDate: Date;
  booksPlace: string;
  catCode: string;
  booksMethod: string;
  booksAmmount: number;
  insDate: Date;
  insUser: String;
  updDate: Date;
  updUser: String;
  catCodes: Category;
};

/**
 * タイプ
 */
export type Type = {
  code: string;
  name: string;
};

/**
 * フラグ
 */
export type Flag = {
  value: string;
  name: string;
};

/**
 * カテゴリーUI
 */
export type CategoryUi = {
  form: Category;
  imgTypes: Type[];
  catTypes: Type[];
  active: Flag;
  delete: Flag;
};

/**
 * エラー
 */
export type ErrorResult = {
  code: string;
  message: string;
  itemPath: string;
  isError: boolean;
};

/**
 * エラー
 */
export type ErrorResults = {
  errorResults: ErrorResult[];
};

/**
 * form入力確認画面表示リスト用データ保持
 */
export type FormConfirmData = {
  id: string;
  name: string;
  value: string;
  type: string;
};

/**
 * ListTableForm作成時使用object作成メソッドで使用するconfigのタイプ
 */
export type buildListTableFormObjConfig = {
  className: string;
  list: {
    name: string;
    addition: {
      yup: RequiredStringSchema<string, AnyObject>;
      isServerValidation: boolean;
      errData: ErrorResults;
      setErrData: (value: React.SetStateAction<{}>) => void;
    };
  }[];
};
