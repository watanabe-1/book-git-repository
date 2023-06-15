const item1 = document.getElementById('item1');
const item5 = document.getElementById('item5');
const item2 = document.getElementById('item2');
const item4 = document.getElementById('item4');

// itemの複製
let item5_copy = item5.cloneNode(true);
let item1_copy = item1.cloneNode(true);
let item2_copy = item2.cloneNode(true);
let item4_copy = item4.cloneNode(true);

// item1の前、item5の後、複製item1の後に複製したitemを表示
item1.before(item5_copy);
item5.after(item1_copy);
item1_copy.after(item2_copy);
item5_copy.before(item4_copy);

/*----------------------------------------------------------------------------*/

// prevとnextの切り替えのボタン
const prev = document.getElementById('prev');
const next = document.getElementById('next');

// slider-contents内にあるdivタグを取得
let sliderContents = document.getElementById('slider-contents');
let slider = sliderContents.getElementsByTagName('div')


next.addEventListener('click', () => {
  // 連続でクリックできないようにする処理
  setTimeout(() => {
    next.disabled = true;
    setTimeout(() => {
      next.disabled = false;
    }, 1000);
  }, 0);

 // itemを切り替える処理
  for (let i = 0; i < slider.length; i++) {
    if (slider[i].classList.contains('slider-item1') === true) {
      slider[i].classList.remove('slider-item1');
      slider[i].classList.add('slider-item2');

    } else if (slider[i].classList.contains('slider-item2') === true) {
      slider[i].classList.remove('slider-item2');
      slider[i].classList.add('slider-item3');
    } else if (slider[i].classList.contains('slider-item3') === true) {
      slider[i].classList.remove('slider-item3');
      slider[i].classList.add('slider-item4');
    } else if (slider[i].classList.contains('slider-item4') === true) {
      slider[i].classList.remove('slider-item4');
      slider[i].classList.add('slider-item5');
    } else if (slider[i].classList.contains('slider-item5') === true) {
      slider[i].classList.remove('slider-item5');
      // item1の複製に移動（表示）させる
      slider[i].classList.add('slider-item1_copy');
      // slider-item1_copyが追加された1秒後にslider-item1_copyを削除してslider-item1_returnを追加する
      setTimeout( () => {
        slider[i].classList.remove('slider-item1_copy');
        slider[i].classList.add('slider-item1_return');
        // setTimeoutを1秒に設定しているのはcssで「transitionにて1s」を指定しているから
        // 1秒かけてitemが移動し、移動が完了したタイミングで瞬時にitem1と同じ位置に移動させるため
      }, 1000);
    }  else if (slider[i].classList.contains('slider-item1_return') === true) {
      slider[i].classList.remove('slider-item1_return');
      // slider-item1_returnの位置はitem1と同じであるため、slider-item2を加える
      slider[i].classList.add('slider-item2');
    }
  }
})


prev.addEventListener('click', () => {
  // 連続でクリックできないようにする処理
  setTimeout(() => {
    prev.disabled = true;
    setTimeout(() => {
      prev.disabled = false;
    }, 1000);
  }, 0);

  // itemを切り替える処理
  for (let i = 0; i < slider.length; i++) {
    if (slider[i].classList.contains('slider-item5') === true) {
      slider[i].classList.remove('slider-item5');
      slider[i].classList.add('slider-item4');
    } else if (slider[i].classList.contains('slider-item4') === true) {
      slider[i].classList.remove('slider-item4');
      slider[i].classList.add('slider-item3');
    } else if (slider[i].classList.contains('slider-item3') === true) {
      slider[i].classList.remove('slider-item3');
      slider[i].classList.add('slider-item2');
    } else if (slider[i].classList.contains('slider-item2') === true) {
      slider[i].classList.remove('slider-item2');
      slider[i].classList.add('slider-item1');
    } else if (slider[i].classList.contains('slider-item1') === true) {
      slider[i].classList.remove('slider-item1');
      // slider-item5の複製を表示させる
      slider[i].classList.add('slider-item5_copy');
      setTimeout( () => {
        slider[i].classList.remove('slider-item5_copy');
        slider[i].classList.add('slider-item5_return');
      }, 1000);
    } else if (slider[i].classList.contains('slider-item5_return') === true) {
      slider[i].classList.remove('slider-item5_return');
      slider[i].classList.add('slider-item4');
    }
  }
})

/*----------------------------------------------------------------------------*/
// 3秒ごとにitemを切り替える処理
window.addEventListener('load', () => {
  let timer3S = setInterval(() => {
    for (let i = 0; i < slider.length; i++) {
      if (slider[i].classList.contains('slider-item1') === true) {
        slider[i].classList.remove('slider-item1');
        slider[i].classList.add('slider-item2');
      } else if (slider[i].classList.contains('slider-item2') === true) {
        slider[i].classList.remove('slider-item2');
        slider[i].classList.add('slider-item3');
      } else if (slider[i].classList.contains('slider-item3') === true) {
        slider[i].classList.remove('slider-item3');
        slider[i].classList.add('slider-item4');
      } else if (slider[i].classList.contains('slider-item4') === true) {
        slider[i].classList.remove('slider-item4');
        slider[i].classList.add('slider-item5');
      } else if (slider[i].classList.contains('slider-item5') === true) {
        slider[i].classList.remove('slider-item5');
        // item1の複製に移動（表示）させる
        slider[i].classList.add('slider-item1_copy');
        // slider-item1_copyが追加された1秒後にslider-item1_copyを削除してslider-item1_returnを追加する
        setTimeout( () => {
          slider[i].classList.remove('slider-item1_copy');
          slider[i].classList.add('slider-item1_return');
          // setTimeoutを1秒に設定しているのはcssで「transitionにて1s」を指定しているから
          // 1秒かけてitemが移動し、移動が完了したタイミングで瞬時にitem1と同じ位置に移動させるため
        }, 1000);
      }  else if (slider[i].classList.contains('slider-item1_return') === true) {
        slider[i].classList.remove('slider-item1_return');
        // slider-item1_returnの位置はitem1と同じであるため、slider-item2を加える
        slider[i].classList.add('slider-item2');
      }
      // clearInterval(timer3S);
    }
  }, 3000);
});
