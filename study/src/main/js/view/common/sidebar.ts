import '../../common/common';
import { swichClass } from '../../study/util/studyUtil';

// CSS script ボタンクリック時にクラスがなかったら付与あったら削除することで、出し入れを行う
const menu_btn: HTMLAnchorElement = document.querySelector(
  '#menu-btn'
) as HTMLAnchorElement;
if (menu_btn) {
  const menu_btn_i: HTMLElement = menu_btn.querySelector('i');
  menu_btn.addEventListener('click', () => {
    if (menu_btn_i) {
      swichClass(menu_btn_i, 'bi-text-left', 'bi-text-right');
    }
  });
}
