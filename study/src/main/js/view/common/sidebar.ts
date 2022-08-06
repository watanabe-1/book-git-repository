import '../../common/common';
import * as studyUtil from './../../study/util/studyUtil';

// CSS script ボタンクリック時にクラスがなかったら付与あったら削除することで、出し入れを行う
const menu_btn: HTMLAnchorElement = document.querySelector(
  '#menu-btn'
) as HTMLAnchorElement;
if (menu_btn) {
  const menu_btn_i: HTMLElement = menu_btn.querySelector('i');
  const sidebar: HTMLElement = document.querySelector('#sidebarMenu');
  const container: HTMLElement = document.querySelector('.my-container');
  menu_btn.addEventListener('click', () => {
    if (sidebar && container) {
      sidebar.classList.toggle('active-nav');
      container.classList.toggle('active-cont');
      studyUtil.swichClass(menu_btn_i, 'bi-text-left', 'bi-text-right');
    }
  });
}
