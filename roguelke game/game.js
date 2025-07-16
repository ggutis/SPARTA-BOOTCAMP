import chalk from 'chalk';
import readlineSync from 'readline-sync';


// 스테이지별로 등장할 몬스터 이름 리스트
const MonsterType = ["슬라임", "고블린", "울프", "오크", "트롤", "골렘", "리자드맨", "뱀파이어", "리치", "드래곤"];

class Player {
  constructor() {
    this.hp = 100;
    this.atk = 24;
    this.character = "전사";
  }

  attack() {
    const isCombo = Math.random() < 0.2; // 20% 확률로 연속 공격
    if (isCombo) {
      const bonus1 = Math.floor(Math.random() * 20) + 1;
      const bonus2 = Math.floor(Math.random() * 20) + 1;
      const totalDamage = (this.atk / 2 + bonus1) + (this.atk / 2 + bonus2);
      return { damage: totalDamage, combo: true };
    } else {
      const bonus = Math.floor(Math.random() * 40) + 1;
      return { damage: this.atk + bonus, combo: false };
    }
  }

  defend(damage) {
    const isPerfect = Math.random() < 0.5; // 20% 확률 완벽 방어
    if (isPerfect) {
      return { reducedDamage: 0, status: 'perfect' };
    } else {
      return { reducedDamage: damage, status: 'fail' };
    }
  }

  levelUp() {
    const hpIncrease = 10;
    const atkIncrease = 3;
    this.hp = 100 + hpIncrease;
    this.atk += atkIncrease;
    console.log(chalk.greenBright(`스테이지 클리어! HP +${hpIncrease}, 공격력 +${atkIncrease} 증가!`));
  }
}


class Monster {
  constructor(stage) {
    this.stage = stage;
    this.hp = 100 + stage * 30; // 스테이지당 HP +30
    this.baseAtk = 2;
    this.atk = this.baseAtk + stage * 2; // 스테이지당 공격력 +2
    this.name = MonsterType[stage - 1] || "unknown Monster";
  }

  attack() {
    return this.atk;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 직업:${player.character} Hp:${player.hp} 공격력:${player.atk}`,
    ) +
    chalk.redBright(
      `| 몬스터:${monster.name} HP:${monster.hp} 공격력:${monster.atk} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(`\n1. 공격한다  2. 방어  3. 도망친다`)
    );
    const choice = readlineSync.question('What is your Choise? ');

    if (choice === "1") {
      const attackResult = player.attack();
      const damage = attackResult.damage;
      const combo = attackResult.combo;
      monster.hp -= damage;


      if (combo) {
        logs.push(chalk.yellow(`${player.character}의 연속 공격 발동! 총 ${damage} 데미지를 주었다!`));
      } else {
        logs.push(chalk.green(`${player.character}가 ${monster.name}에게 ${damage} 데미지를 주었다!`));
      }

      const monsterDamage = monster.attack();
      player.hp -= monsterDamage;
      logs.push(chalk.red(`${monster.name}가 ${player.character}에게 ${monsterDamage} 데미지를 주었다!`));

    } else if (choice === "2") {
      const monsterDamage = monster.attack();
      const { reducedDamage, status } = player.defend(monsterDamage);
      player.hp -= reducedDamage;

      if (status === 'perfect') {
        logs.push(chalk.blue(`${player.character}의 완벽 방어! 피해를 받지 않았다!`));
      } else if (status === 'fail') {
        logs.push(
          chalk.blue(`${player.character}가 방어에 실패했다! ${monster.name}의 공격을 받아 ${reducedDamage} 데미지를 입었다!`)
        );
      }


    } else if (choice === "3") {
      console.log(chalk.green(`${monster.name}에게서 도망쳤다.`));
      readlineSync.question('press Enter...');
      return false;
    } else {
      logs.push(chalk.yellow('잘못된 입력입니다!'));
    }

    if (player.hp < 0) player.hp = 0;
    if (monster.hp < 0) monster.hp = 0;

    // 로그길이 제한
    if (logs.length > 3) logs.shift();

    if (player.hp <= 0) {
      console.log(chalk.red("\n플레이어가 패배했습니다!"));
      return false;
    } else if (monster.hp <= 0) {
      console.log(chalk.yellow(`\n${monster.name}을 물리쳤습니다!`));
      return true;
    }
  }
};


export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    const result = await battle(stage, player, monster);

    if (!result && player.hp <= 0) {
      console.log(chalk.red("게임 오버!"));
      break;
    }

    if (monster.hp <= 0) {
      player.levelUp();
      stage++;
      console.log(chalk.greenBright(`Stage ${stage - 1} 클리어! 다음 스테이지로 이동!`));
      readlineSync.question('Press Enter to move to the next stage...');
    }
  }

  if (player.hp > 0 && stage > 10) {
    console.log(chalk.greenBright("\n모든 스테이지를 클리어했습니다! 승리!"));
  }
}
