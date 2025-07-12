// index.js
import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.name = "전사";
  }

  attack() {
    this.attackDamage = Math.floor(Math.random() * 100);

    switch(true) {
      case this.attackDamage >= 50:
        console.log(`강공격! ${this.attackDamage} 데미지를 주었습니다.`);
        return this.attackDamage;
      case this.attackDamage >= 20:
        console.log(`약공격! ${this.attackDamage} 데미지를 주었습니다.`);
        return this.attackDamage;
      default:
        console.log(`Miss`);
        return 0;
    }
  }
}

class Monster {
  constructor(stage) {
    this.maxHp = 50 + stage * 10;
    this.hp = this.maxHp;
    this.name = `Stage${stage} 몬스터`;
  }

  attack() {
    this.attackDamage = Math.floor(Math.random() * 100);

    switch(true) {
      case this.attackDamage >= 50:
        console.log(`몬스터 강공격! ${this.attackDamage} 데미지를 주었습니다.`);
        return this.attackDamage;
      case this.attackDamage >= 20:
        console.log(`몬스터 약공격! ${this.attackDamage} 데미지를 주었습니다.`);
        return this.attackDamage;
      default:
        console.log(`몬스터 Miss`);
        return 0;
    }
  }
}

// ✅ HP바 시각화 함수
function renderHpBar(current, max) {
  const totalBars = 20;
  const filledBars = Math.round((current / max) * totalBars);
  const emptyBars = totalBars - filledBars;

  return chalk.green('█'.repeat(filledBars)) + chalk.gray('░'.repeat(emptyBars));
}

// ✅ 상태 출력
function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Stage ${stage} ===`));
  console.log(
    chalk.cyanBright(`${player.name} HP: ${player.hp}/${player.maxHp} `) + renderHpBar(player.hp, player.maxHp)
  );
  console.log(
    chalk.redBright(`몬스터 HP: ${monster.hp}/${monster.maxHp} `) + renderHpBar(monster.hp, monster.maxHp)
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

async function battle(stage, player, monster) {
  let logs = [];

  while(player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);
    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다  2. 아무것도 하지 않는다`));
    const choice = readlineSync.question('당신의 선택은? ');

    if (choice === "1") {
      const damage = player.attack();
      monster.hp -= damage;
      if (monster.hp < 0) monster.hp = 0;
      logs.push(chalk.green(`${player.name}가 몬스터에게 ${damage} 데미지를 주었다!`));
    } else {
      logs.push(chalk.green(`${player.name}가 아무것도 하지 않았다.`));
    }

    if (monster.hp > 0) {
      const damage = monster.attack();
      player.hp -= damage;
      if (player.hp < 0) player.hp = 0;
      logs.push(chalk.red(`몬스터가 ${player.name}에게 ${damage} 데미지를 주었다!`));
    }

    if (logs.length > 10) logs.shift();
  }

  if (player.hp <= 0) {
    console.log(chalk.red("\n플레이어가 패배했습니다!"));
    return false;
  } else if (monster.hp <= 0) {
    console.log(chalk.yellow("\n몬스터를 물리쳤습니다!"));
    return true;
  }
}

// ✅ 게임 메인 로직
export async function startGame() {
  while (true) {
    console.clear();
    console.log(chalk.blueBright("=== 텍스트 RPG 게임 시작! ==="));
    console.log(chalk.greenBright("1. 게임 시작"));
    console.log(chalk.gray("0. 종료"));
    const startChoice = readlineSync.question('선택: ');

    if (startChoice === "0") {
      console.log(chalk.yellow("게임을 종료합니다. 안녕히 가세요!"));
      break;
    }

    const player = new Player();
    let stage = 1;

    while (stage <= 5) {
      console.log(chalk.yellowBright(`\nStage ${stage} 몬스터 출현!`));
      const monster = new Monster(stage);

      const result = await battle(stage, player, monster);

      if (!result) {
        console.log(chalk.red("게임 오버!"));
        break;
      }

      console.log(chalk.greenBright(`Stage ${stage} 클리어! 다음 스테이지로 이동!`));
      stage++;
    }

    if (player.hp > 0 && stage > 5) {
      console.log(chalk.greenBright("\n🎉 모든 스테이지를 클리어했습니다! 승리!"));
    }

    // ✅ 게임 종료 후 다시 시작 여부
    const retry = readlineSync.question(chalk.cyanBright("\n다시 시작하려면 1, 종료하려면 0 입력: "));
    if (retry !== "1") {
      console.log(chalk.yellow("게임을 종료합니다!"));
      break;
    }
  }
}

// 시작
startGame();
