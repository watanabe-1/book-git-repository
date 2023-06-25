const item1 = document.getElementById("item1");
const item5 = document.getElementById("item5");
const item2 = document.getElementById("item2");
const item4 = document.getElementById("item4");

// itemの複製
const item5_copy = item5.cloneNode(true);
const item1_copy = item1.cloneNode(true);
const item2_copy = item2.cloneNode(true);
const item4_copy = item4.cloneNode(true);

// item1の前、item5の後、複製item1の後に複製したitemを表示
item1.before(item5_copy);
item5.after(item1_copy);
item1_copy.after(item2_copy);
item5_copy.before(item4_copy);

/*----------------------------------------------------------------------------*/

// prevとnextの切り替えのボタン
const prev = document.getElementById("prev");
const next = document.getElementById("next");

// slider-contents内にあるdivタグを取得
const sliderContents = document.getElementById("slider-contents");
const slider = sliderContents.getElementsByTagName("div");

const MIN_DIV_NUM = 1;
const MAX_DIV_NUM = 5;
let cnt = MIN_DIV_NUM;

const contUp = (cnt) => {
  if (cnt <= MAX_DIV_NUM) {
    cnt++;
  } else {
    cnt = MIN_DIV_NUM + 1;
  }
  return cnt;
};

const contDown = (cnt) => {
  if (cnt >= MIN_DIV_NUM) {
    cnt--;
  } else {
    cnt = MAX_DIV_NUM - 1;
  }
  return cnt;
};

const setDisabledBtn = (disabled) => {
  next.disabled = disabled;
  prev.disabled = disabled;
  console.log(`disabled:${disabled}`);
  console.log(`next.disabled:${next.disabled}`);
};

const isDisabled = () => {
  return next.disabled && prev.disabled;
};

const switchClass = (i, removeClass, addClass) => {
  if (slider[i].classList.contains(removeClass)) {
    slider[i].classList.remove(removeClass);
    slider[i].classList.add(addClass);
  }
};

const nextClass = (cnt) => {
  for (let i = 0; i < slider.length; i++) {
    console.log(`next${cnt}`);
    if (cnt < MAX_DIV_NUM) {
      switchClass(i, `slider-item${cnt}`, `slider-item${cnt + 1}`);
      // prev で _returnクラスが設定されたとき
      switchClass(
        i,
        `slider-item${MAX_DIV_NUM}_return`,
        `slider-item${MIN_DIV_NUM}`
      );
    }
    if (cnt == MAX_DIV_NUM) {
      if (slider[i].classList.contains(`slider-item${MAX_DIV_NUM}`)) {
        slider[i].classList.remove(`slider-item${MAX_DIV_NUM}`);
        // item1の複製に移動（表示）させる
        slider[i].classList.add(`slider-item${MIN_DIV_NUM}_copy`);
        // slider-item1_copyが追加された1秒後にslider-item1_copyを削除してslider-item1_returnを追加する
        setTimeout(() => {
          slider[i].classList.remove(`slider-item${MIN_DIV_NUM}_copy`);
          slider[i].classList.add(`slider-item${MIN_DIV_NUM}_return`);
          // setTimeoutを1秒に設定しているのはcssで「transitionにて1s」を指定しているから
          // 1秒かけてitemが移動し、移動が完了したタイミングで瞬時にitem1と同じ位置に移動させるため
        }, 1000);
      }
    }
    if (cnt > MAX_DIV_NUM) {
      switchClass(
        i,
        `slider-item${MIN_DIV_NUM}_return`,
        `slider-item${MIN_DIV_NUM + 1}`
      );
    }
  }
};

const prevClass = (cnt) => {
  for (let i = 0; i < slider.length; i++) {
    console.log(`prev${cnt}`);
    if (cnt > MIN_DIV_NUM) {
      switchClass(i, `slider-item${cnt}`, `slider-item${cnt - 1}`);
      // next で _returnクラスが設定されたとき
      switchClass(
        i,
        `slider-item${MIN_DIV_NUM}_return`,
        `slider-item${MAX_DIV_NUM}`
      );
    }
    if (cnt == MIN_DIV_NUM) {
      if (slider[i].classList.contains(`slider-item${MIN_DIV_NUM}`)) {
        slider[i].classList.remove(`slider-item${MIN_DIV_NUM}`);
        // slider-item5の複製を表示させる
        slider[i].classList.add(`slider-item${MAX_DIV_NUM}_copy`);
        setTimeout(() => {
          slider[i].classList.remove(`slider-item${MAX_DIV_NUM}_copy`);
          slider[i].classList.add(`slider-item${MAX_DIV_NUM}_return`);
        }, 1000);
      }
    }
    if (cnt < MIN_DIV_NUM) {
      switchClass(
        i,
        `slider-item${MAX_DIV_NUM}_return`,
        `slider-item${MAX_DIV_NUM - 1}`
      );
    }
  }
};

// スライダーの自動スクロールを開始する関数
const startSlider = () => {
  timerId = setInterval(() => {
    const sliderContents = document.getElementById("slider-contents");
    sliderContents.style.transform = "translateX(-100%)";
    const firstSlide = document.querySelector(".slider-item:first-child");
    sliderContents.appendChild(firstSlide);
  }, 3000);
};

// スライダーの自動スクロールを停止する関数
function stopSlider() {
  clearInterval(timerId);
}

next.addEventListener("click", async () => {
  // itemを切り替える処理
  await setDisabledBtn(true);
  await nextClass(cnt);
  cnt = await contUp(cnt);
  await setTimeout(() => setDisabledBtn(false), 1000);
});

prev.addEventListener("click", async () => {
  // itemを切り替える処理
  await setDisabledBtn(true);
  await prevClass(cnt);
  cnt = await contDown(cnt);
  await setTimeout(() => setDisabledBtn(false), 1000);
});

/*----------------------------------------------------------------------------*/
// 3秒ごとにitemを切り替える処理
window.addEventListener("load", () => {
  let timer3S = setInterval(async () => {
    if (!isDisabled()) {
      await setDisabledBtn(true);
      await nextClass(cnt);
      cnt = await contUp(cnt);
      await setDisabledBtn(false);
    }
  }, 3000);
});
