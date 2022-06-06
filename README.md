## Site

https://game-yut.web.app

## 설명

**윳놀이 게임**  
(json type의 객체형태로 data를 업데이트하고, 축적된 데이터를 ui로 표현)

public/src/game.js

## API

styled-components, json type data update, es6, javascript, css3

## Rule

1. 말판 선택하여 그리드 그리기(30개 단위)
2. 내가 먼저 시작
3. 컴퓨터는 자동 시작
4. 컴퓨터와 나의 말판이 겹칠수 있음(색깔로 구분시 두개 컬러가 같은 말판에서 표시되어야함)
5. 윷이나 모가 나오면 한번 더 할 수 있음(상대방에게 플레이 기회 주지 않음)
6. 끝까지 먼저 도착하면 “나(컴퓨터)님이 승리하였습니다.” 메시지 확인창 뜨고 스코어 1점 올라감

## 기능

### 1. styled-components in javascript

```javascript
const {
  color: { orange, green, yellow, gray },
  cicle: { cicleProperties, cicleValue },
} = STYLE.css;

$targetBox.innerHTML += `<span style="display:inline-block;${cicleProperties}:${cicleValue};background-color:${
    STYLE.script.thisId(target) === 1 ? orange : green
};
```

```javascript
const RENDER = () => {
  const player = (() => {
    let htmlPlayer = GAME_DATA.userData.map(
      ({ id, name, turnTool, score, color }, idx) => {
        let deffrentColor = !idx ? color.abled : color.disabled;
        return `
          <h2>${name}</h2>
          <strong>${score}</strong>
          <div class="box" data-taget="box" style="border:4px solid ${
            color.abled
          }; color:${
          id === 1 ? orange : green
        }; font-size: 46px; font-weight: bold">${turnTool}</div>
          <button type="button" id="${id}" class="btn-start" style="background-color:${deffrentColor}; border: 1px solid ${deffrentColor}" ${
          id === 1 ? "" : "disabled"
        }>start</button>
        `;
      }
    );
    const [my, computer] = htmlPlayer;
    $AreaMy.innerHTML = my;
    $AreaComputer.innerHTML = computer;
  })();

```

### 2. json data

```javascript
userData: [
      {
        id: 1,
        name: "나",
        turnTool: "",
        score: 0,
        steps: 0,
        stepsClass: "on-1",
        color: {
          abled: "orange",
          disabled: "gray",
        },
      },
      {
        id: 2,
        name: "컴퓨터",
        turnTool: "",
        score: 0,
        steps: 0,
        stepsClass: "on-2",
        color: {
          abled: "green",
          disabled: "gray",
        },
      },
    ],
    game: {
      tool: [
        {
          toolName: "도",
          jump: 1,
          oneMore: false,
        },
        {
          toolName: "개",
          jump: 2,
          oneMore: false,
        },
        {
          toolName: "걸",
          jump: 3,
          oneMore: false,
        },
        {
          toolName: "윳",
          jump: 4,
          oneMore: true,
        },
        {
          toolName: "모",
          jump: 5,
          oneMore: true,
        },
      ],
    },
```

### 3. data update

```javascript
const UPDATE = {
  data() {
    CHECK_IF(
      (userData, ranDomTool) => {
        userData.steps += ranDomTool.jump;
        userData.turnTool = ranDomTool.toolName;
      },
      (name, userData) => {
        userData.score = userData.score + 1;
      }
    );
  },
  drawUi(target, list) {
    GAME_DATA.userData.map(({ steps }, index) => {
      let _index = index + 1;
      if (_index === _targetId) stepValue[index] = steps;
    });
  },
  init(target, targetId) {
    _targetId = targetId;
    STYLE.css.disabled(target);
    CICLE_RENDER(target);
    this.data();
    NODE_MALPAN((list) => this.drawUi(list));
  },
};
```

### 4. 클릭 이벤트

```javascript
window.addEventListener("load", DEFAULT);

$tab.addEventListener("change", ({ target }) => {
  if (!target.classList.contains("radio-btn")) return;
  TAB_CHECKED(target, STYLE.script.thisId(target.parentNode));
  RENDER();
  NODE_MALPAN((list) => (list.className = ""));
});

$AreaComputer.addEventListener("click", ({ target }) => {
  if (!target.classList.contains("btn-start")) return;
  UPDATE.init(target, STYLE.script.thisId(target));
  setTimeout(RENDER, SPEED);
});

$AreaMy.addEventListener("click", ({ target }) => {
  if (!target.classList.contains("btn-start")) return;
  RESET.tabs();
  UPDATE.init(target, STYLE.script.thisId(target));
  setTimeout(RENDER, SPEED);
});
```
