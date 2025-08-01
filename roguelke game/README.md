# 🎮 텍스트 기반 로그라이크 RPG

Node.js로 개발된 간단한 턴제 텍스트 RPG입니다. 매 스테이지마다 강력해지는 몬스터를 상대로 자신의 한계를 시험하고, 최종 스테이지까지 살아남아 게임을 클리어하세요!

---

## 📝 기능 구현 리스트

1.  **턴제 전투 시스템**: 플레이어와 몬스터가 차례대로 공격, 방어, 도망 등의 행동을 선택하는 클래식한 턴제 전투를 구현했습니다. 여기에 확률적 요소를 더하여, 공격 시 일정 확률로 '연속 공격'이, 방어 시 일정 확률로 '완벽한 방어'가 발동되도록 하여 전투의 재미를 더했습니다.
2.  **직업 시스템**: 각기 다른 능력치(체력, 공격력, 특수 능력 확률)를 가진 전사, 마법사, 궁수 3가지 직업 중 하나를 선택하여 플레이할 수 있도록 구현했습니다.
3.  **성장 시스템**: 스테이지를 클리어할 때마다 플레이어의 최대 체력(+10)과 공격력(+3)이 영구적으로 상승하며, 현재 체력이 모두 회복되도록 구현했습니다.
4.  **몬스터 시스템**: 총 10개의 스테이지를 진행하며, 각 스테이지마다 다른 종류의 몬스터(슬라임, 고블린, 드래곤 등)가 출현하도록 구현했습니다. 또한, 다음 스테이지로 넘어갈수록 몬스터의 체력(+30/stage)과 공격력(+2/stage)이 강해지도록 구현했습니다.
5.  **시각적 표현**: `chalk` 라이브러리를 활용하여 전투 상황, 캐릭터 정보, 시스템 메시지 등을 다채로운 색상으로 표현하여 가독성과 몰입감을 높였습니다.

---

## 🛠️ 설치 및 실행

### 요구 사항

*   [Node.js](https://nodejs.org/)
*   npm (Node.js 설치 시 함께 설치됨)

### 설치 과정

1.  **프로젝트 클론**

    ```bash
    git clone https://github.com/your-username/roguelike-game.git
    ```

2.  **프로젝트 폴더로 이동**

    ```bash
    cd roguelike-game
    ```

3.  **필요한 패키지 설치**

    ```bash
    npm install
    ```

### 실행

아래 명령어를 터미널에 입력하여 게임을 시작합니다.

```bash
node sever.js
```

---

## 📖 게임 방법

1.  게임이 시작되면 먼저 플레이할 직업을 선택합니다.
2.  각 스테이지마다 몬스터가 등장하며 전투가 시작됩니다.
3.  매 턴마다 **[1. 공격, 2. 방어, 3. 도망]** 중 하나의 행동을 선택할 수 있습니다.
4.  몬스터의 HP를 0으로 만들면 스테이지를 클리어하고 캐릭터가 성장합니다.
5.  플레이어의 HP가 0이 되면 게임 오버입니다.
6.  최종 10 스테이지까지 모두 클리어하면 게임에서 승리합니다.


---

## 🐛 트러블슈팅

개발 과정에서 발생했던 주요 버그와 해결 과정입니다.

### 1. 전투 종료 메시지 미출력
*   **문제 현상**: 몬스터를 처치하거나 플레이어가 패배했을 때, 전투 종료 메시지가 출력되지 않고 바로 다음 로직으로 넘어가는 문제가 있었습니다.
*   **원인 분석**: `battle` 함수의 `while` 루프 내에서 `player.hp` 또는 `monster.hp`가 0 이하가 되었을 때, `return` 문으로 즉시 함수가 종료되면서 마지막 로그 메시지를 출력할 기회가 없었습니다.
*   **해결 방안**: `while` 루프의 조건을 `player.hp > 0 && monster.hp > 0`으로 유지하되, 루프 바로 다음에 전투 결과 메시지를 출력하도록 로직을 수정했습니다.

### 2. 스테이지 자동 클리어 현상
*   **문제 현상**: 전투에서 승리한 후, 다음 스테이지가 시작될 때 새로운 몬스터와 전투를 시작하지 않고 바로 스테이지가 클리어되는 버그가 발생했습니다.
*   **원인 분석**: 이전 스테이지의 전투 결과(`result`)가 다음 스테이지에 영향을 주는 상태 관리의 문제였습니다. `battle` 함수에서 반환된 `true` 값이 `startGame` 함수의 `while` 루프에 그대로 남아, 새로운 몬스터를 생성하고도 전투 로직을 건너뛰었습니다.
*   **해결 방안**: `startGame` 함수의 `while` 루프 내에서 매번 새로운 `Monster` 객체를 생성하여 전투 상태를 초기화하고, `battle` 함수의 반환 값을 명확하게 처리하여 다음 스테이지 진행 여부를 결정하도록 로직을 강화했습니다.

### 3. 순환 참조로 인한 `ReferenceError` 발생
*   **문제 현상**: 전투 중 '도망치기'를 선택하면 게임을 재시작하기 위해 `start()` 함수를 호출하는 과정에서 `ReferenceError: Cannot access 'start' before initialization` 오류가 발생했습니다.
*   **원인 분석**: `sever.js`는 `game.js`의 `startGame` 함수를, `game.js`는 `sever.js`의 `start` 함수를 서로 `import` 하면서 순환 참조(Circular Dependency)가 발생했습니다. 이로 인해 `game.js` 모듈이 `start` 함수를 필요로 하는 시점에 `sever.js` 모듈의 `start` 함수가 아직 초기화되지 않은 상태였습니다.
*   **해결 방안**: `sever.js`에서 `start` 함수를 `export` 하는 방식과 `game.js`에서 `import` 하는 방식을 Named Export/Import (`export { start }`, `import { start } from ...`)로 통일하여, 모듈 간의 의존성을 명확하게 해결했습니다. 이를 통해 모듈 로딩 시점에서 발생하는 초기화 오류를 방지할 수 있었습니다.

---

## 🤔 개발 회고 (어려웠던 점 및 해결 과정)

단순한 버그 수정을 넘어, 프로젝트의 구조를 설계하며 고민했던 지점들입니다.

### 1. 객체지향 설계의 필요성
*   **고민**: 처음에는 플레이어와 몬스터를 단순 객체로 구현했습니다. 하지만 '직업'이라는 개념이 추가되면서, 각기 다른 능력치를 가진 캐릭터들을 관리하기가 복잡해졌고 코드 중복이 발생했습니다.
*   **해결**: `Player`라는 부모 클래스를 만들고, 각 직업(`Warrior`, `Mage`, `Archer`)이 이를 상속받는 구조로 변경했습니다. 이를 통해 코드의 재사용성을 높이고, 향후 새로운 직업을 추가하기 용이한 확장성 있는 구조를 만들 수 있었습니다.