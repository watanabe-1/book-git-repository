import './../../common/common';
import * as studyUtil from './../../study/util/studyUtil';

// CSS script ボタンクリック時にクラスがなかったら付与あったら削除することで、出し入れを行う
const menu_btn = document.querySelector('#menu-btn');
const menu_btn_i = menu_btn.querySelector('i');
const sidebar = document.querySelector('#sidebarMenu');
const container = document.querySelector('.my-container');
menu_btn.addEventListener('click', () => {
  sidebar.classList.toggle('active-nav');
  container.classList.toggle('active-cont');
  studyUtil.swichClass(menu_btn_i, 'bi-text-left', 'bi-text-right');
});
