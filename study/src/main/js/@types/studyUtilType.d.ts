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