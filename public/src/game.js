const $Area = document.querySelectorAll(".area");
const $AreaComputer = document.querySelector("[data-target=computer-area]");
const $AreaMy = document.querySelector("[data-target=my-area]");
const $AreaPlayGround = document.querySelector("[data-target=playGround]");
const $tab = document.querySelector("[data-target=tab]");
const $malpan = document.querySelector("[data-target=malpan]");
const $box = document.querySelector("[data-target=box]");

const DATA = () => {
  return {
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
    tabList: [
      {
        id: 1,
        name: "말판01",
        malpan: 30,
        disabled: "",
        checked: "",
      },
      {
        id: 2,
        name: "말판02",
        malpan: 60,
        disabled: "",
        checked: "",
      },
      {
        id: 3,
        name: "말판03",
        malpan: 90,
        disabled: "",
        checked: "",
      },
      {
        id: 4,
        name: "말판04",
        malpan: 120,
        disabled: "",
        checked: "",
      },
    ],
  };
};

let GAME_DATA = {};
let nowMalPan = 0;
let stepValue = [];
let _targetId = 0;
let addTargets = [];
let _malpan = 0;
let _tabCheckedId = 0;
let on = {
  target_1: "",
  target_2: "",
};

const CICLE_SHAPE = "";
const SPEED_FAST = 200; //속도
const SPEED = SPEED_FAST * 4;

const STYLE = (() => {
  const css = {
    typeCheck(target, callBack) {
      if (Symbol.iterator in target === true) {
        for (const value of target) callBack(value);
      } else callBack(target);
    },
    disabled(target) {
      this.typeCheck(target, (value) => (value.disabled = true));
    },
    abled(target) {
      this.typeCheck(target, (value) => (value.disabled = false));
    },
    add(target, className) {
      target.classList.add(className);
    },
    remove(target, className) {
      target.classList.remove(className);
    },
    cicle: {
      cicleProperties: "border-radius",
      cicleValue: "100%",
    },
    color: {
      orange: "orange",
      green: "green",
      yellow: "yellow",
      gray: "#999",
    },
  };

  const script = {
    random(array) {
      return array[Math.floor(Math.random() * array.length)];
    },
    loop(numbers, callBack) {
      for (let i = 0; i < numbers; i++) {
        callBack(i);
      }
    },
    thisId(target) {
      return +target.id;
    },
  };

  return {
    css,
    script,
  };
})();

const {
  color: { orange, green, yellow, gray },
  cicle: { cicleProperties, cicleValue },
} = STYLE.css;

const DEFAULT = () => {
  GAME_DATA = DATA();
  RENDER();
  $malpan.innerHTML = `말판 'Tab'을 클릭해 주세요`;
  STYLE.css.disabled($AreaMy.children[3]);
};

const NODE_MALPAN = (func) => {
  let listGroup = [];
  STYLE.script.loop($malpan.children.length, (values) => {
    const $listGroup = $malpan.children[values];
    func($listGroup);
  });
};

RESET = {
  turnTool() {
    GAME_DATA.userData[0].turnTool = "";
    GAME_DATA.userData[1].turnTool = "";
  },
  steps(index) {
    stepValue[index] = 0;
  },
  tabs() {
    GAME_DATA.tabList.forEach((list, idx) => {
      list.disabled = list.checked === "" ? "disabled" : "";
      if (list.checked === "") {
        for (let i = 0; i < $tab.children[idx].children.length; i++) {
          if (!$tab.children[idx].children[i].classList.contains("radio-btn"))
            return;
          $tab.children[idx].children[i].disabled = true;
        }
      }
    });
  },
};

const TURN_USER = (idNumber, ifData) => {
  if (_targetId === idNumber) {
    let userTurnTool = GAME_DATA.userData[idNumber - 1].turnTool;
    if (ifData(userTurnTool)) {
      if (
        GAME_DATA.userData[idNumber - 1].steps < _malpan &&
        GAME_DATA.tabList[_tabCheckedId - 1].checked === "checked"
      ) {
        STYLE.css.disabled($AreaMy.children[3]);
        setTimeout(() => {
          STYLE.css.abled($AreaComputer.children[3]);
          $AreaComputer.children[3].click();
        }, SPEED);
      }
    }
  }
};

const TAB_CHECKED = (target, id) => {
  GAME_DATA.tabList = GAME_DATA.tabList.map((list) => {
    if (list.id === id) {
      nowMalPan = list.malpan;
      return { ...list, checked: "checked" };
    } else {
      return { ...list, checked: "" };
    }
  });
};

const CHECK_IF = (check1, check2) => {
  const ranDomTool = STYLE.script.random(GAME_DATA.game.tool);
  GAME_DATA.userData.forEach(({ id, name, turnTool, steps }, idx) => {
    let _userData = GAME_DATA.userData[idx];

    if (id === _targetId) {
      check1(_userData, ranDomTool);
      if (_userData.steps >= nowMalPan) {
        check2(name, _userData, GAME_DATA.userData);
      }
    }
  });
};

const CICLE_RENDER = (target) => {
  let current = 0;

  const $targetBox = target.previousElementSibling;
  setTimeout(function go() {
    if (current < 4) {
      $targetBox.innerHTML += `<span style="display:inline-block;${cicleProperties}:${cicleValue};background-color:${
        STYLE.script.thisId(target) === 1 ? orange : green
      };width:40px;height:40px;margin:0 3px;"></span>`;
      setTimeout(go, SPEED_FAST);
    }
    current++;
  }, 0);
  $targetBox.innerHTML = "";
};

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

  //컴퓨터 자동클릭 (user에 따른)
  TURN_USER(1, (userTurnTool) => {
    return (
      userTurnTool === "도" || userTurnTool === "개" || userTurnTool === "걸"
    );
  });

  //컴퓨터 자동클릭 (user에 따른)
  TURN_USER(2, (userTurnTool) => {
    return userTurnTool === "윳" || userTurnTool === "모";
  });

  // 승리 했을때
  CHECK_IF(
    () => {},
    () => {
      setTimeout(() => RESET.steps(1), 100);
      GAME_DATA.tabList.forEach((list, idx) => (list.disabled = ""));
    }
  );

  const tabs = (() => {
    let htmlTab = "";

    GAME_DATA.tabList.forEach(({ id, name, malpan, disabled, checked }) => {
      htmlTab += `
      <li id="${id}">
        <input type="radio" class="radio-btn" id="radio-${id}" name="radioBtn" ${disabled} ${
        checked ? "checked" : ""
      } />
        <label for="radio-${id}" style="background-color:${
        checked === "checked" ? gray : ""
      }" >${name}</label>
      </li>
    `;
    });
    $tab.innerHTML = htmlTab;
  })();

  const malPans = (() => {
    let checkedMalpan = [];
    let htmlMalpanList = "";

    GAME_DATA.tabList.forEach(({ id, malpan, checked }, idx) => {
      if (checked === "checked") {
        _malpan = malpan;
        _tabCheckedId = id;
        for (let i = 1; i <= malpan; i++) {
          STYLE.script.loop(Object.keys(on).length, (value) => {
            let plusValue = value + 1;

            //생성되는 li위치와 스텝숫자가 동일 할 경우 on class 생성
            on[`target_${value + 1}`] =
              i === stepValue[value] ? `target_${value + 1}` : "";

            // 1. 나의 위치가 말판을 넘었을때 on클래스를 마지막에 놓음,
            // 2. 끝났을때 상대방 현재 위치의 on 클래스 제거
            if (stepValue[value] >= malpan) {
              stepValue[value] = malpan;
              RESET.turnTool();
              if (_targetId === GAME_DATA.userData[value].id) {
                stepValue[plusValue + Math.pow(-1, plusValue + 1) - 1] = 0;
              }
            }
          });
          htmlMalpanList += `<li class="${on.target_1} ${on.target_2}"><span>${i} 단계</span></li>`;
        }
        $malpan.innerHTML = htmlMalpanList;
      }
    });
  })();

  // 승리 후 초기화
  CHECK_IF(
    () => {},
    (name, userData, allDATA) => {
      alert(`"${name}"가 이겼습니다`);
      STYLE.script.loop(allDATA.length, (i) => {
        allDATA[i].steps = 0;
      });
    }
  );
};

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
