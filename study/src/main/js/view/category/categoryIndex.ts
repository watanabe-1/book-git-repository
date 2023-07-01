import './../../common/common';
import * as bootstrap from 'bootstrap';

import { Image } from './../../@types/studyUtilType';
import * as studyListUtil from './../../study/list/studyListUtil';
import * as studyUtil from './../../study/util/studyUtil';

//テーブルの内容を並び替えできるようにイベントを追加
//カテゴリーリスト
studyListUtil.addEventListenerOfSortAndFilterTable('categoryListTable', 'AND');

const imgList: Image[] = JSON.parse(
  document.getElementById('imgListData').innerHTML
) as Image[];

let imgNum = 0;
//クリックした時のボタン
let imgConfirmButton: Element;

/**
 * イメージタグの作成
 *
 * @param {Image} imgJson 画像パス
 */
function createImgTag(imgJson: Image): void {
  //画面描画用imageタグの作成
  const imgElement: HTMLImageElement = document.createElement('img');
  imgElement.src =
    //studyUtilのgetContextPath()
    studyUtil.getContextPath() + imgJson.imgPath + '/' + imgJson.imgName; // 画像パス
  imgElement.alt = imgJson.imgName; // 代替テキスト
  imgElement.width = 600; // 横サイズ（px）
  imgElement.height = 450; // 縦サイズ（px）
  imgElement.className = 'mh-100 mw-100';
  //modal内に描画
  const imgCanvas: HTMLDivElement = document.getElementById(
    'imgCanvas'
  ) as HTMLDivElement;
  //StudyUtil.appendOrReplaceChild
  studyUtil.appendOrReplaceChild(imgCanvas, imgElement, 'img');
}

/**
 * 画像を前の画像に変更
 *
 * @param {String} selectedImgId 設定されている画像Id
 */
function defaultImgtag(selectedImgId: string): void {
  let num = 0;
  imgList.forEach((value, index) => {
    //console.log(selectedImgId);
    //console.log(value.imgId);
    if (value.imgId === selectedImgId) {
      //console.log(num);
      num = index;
    }
  });
  imgNum = num;
  createImgTag(imgList[imgNum]);
}

/**
 * 画像を次の画像に変更
 *
 */
function nextImgtag(): void {
  if (imgNum < imgList.length - 1) {
    imgNum++;
  } else {
    imgNum = 0;
  }
  createImgTag(imgList[imgNum]);
}

/**
 * 画像を前の画像に変更
 *
 */
function backImgtag(): void {
  if (imgNum > 0) {
    imgNum--;
  } else {
    imgNum = imgList.length - 1;
  }
  createImgTag(imgList[imgNum]);
}

//list model
const listModalEl: HTMLDivElement = document.getElementById(
  'listModal'
) as HTMLDivElement;
const listModalElObj: bootstrap.Modal = new bootstrap.Modal(listModalEl);

document.querySelectorAll('.modalBtn').forEach((btn) => {
  btn.addEventListener('click', () => {
    //クリックした時のボタン
    imgConfirmButton = btn;
    //imgConfirmButtonから同じtdタグ内に存在するラベル、インプットタグを取得
    const inputElment: HTMLInputElement =
      imgConfirmButton.parentNode.querySelector('input');
    //console.log(inputElment);
    //画面描画用imageタグの作成
    defaultImgtag(inputElment.value);

    //次へボタン
    const nextButton: HTMLButtonElement = listModalEl.querySelector(
      '#nextImg'
    ) as HTMLButtonElement;
    nextButton.addEventListener('click', function () {
      nextImgtag();
    });
    //前へボタン
    const backButton: HTMLButtonElement = listModalEl.querySelector(
      '#backImg'
    ) as HTMLButtonElement;
    backButton.addEventListener('click', function () {
      backImgtag();
    });
    listModalElObj.show();
  });
});

//model内のボタンにイベントの追加
//confirm model-change-button
const listModalSaveButton = listModalEl.querySelector('#saveListModal');
listModalSaveButton.addEventListener('click', function () {
  const imgId: string = imgList[imgNum].imgId;
  //行を指定して取得
  const tds: NodeListOf<HTMLTableCellElement> =
    imgConfirmButton.parentNode.parentNode.querySelectorAll('td');
  //行内に表示している画像の変更
  const imgElement: HTMLImageElement = tds[tds.length - 1].querySelector('img');
  imgElement.src =
    //studyUtilのgetContextPath()
    studyUtil.getContextPath() +
    imgList[imgNum].imgPath +
    '/' +
    imgList[imgNum].imgName; // 画像パス
  //imgConfirmButtonから同じtdタグ内に存在するラベル、インプットタグを取得
  const labelElment: HTMLLabelElement =
    imgConfirmButton.parentNode.querySelector('label');
  const inputElment: HTMLInputElement =
    imgConfirmButton.parentNode.querySelector('input');
  labelElment.innerText = imgId;
  inputElment.value = imgId;

  //modelを閉じる
  listModalElObj.hide();
});
