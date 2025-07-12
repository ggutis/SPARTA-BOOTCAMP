import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.atk = 24;
    this.character = "Woorior";
  }

  attack() {
    // 플레이어의 공격
    const bonus = Math.floor(Math.random() * 10) + 1;
    const damage = this.atk + bonus;

    switch (true) {
      case damage >= 0:
        // console.log(`${this.character}의 공격!!\n ${damage}의 데미지가 들어갔습니다.`);
        return damage;
      default:
        console.log(`Miss`)
        return 0;
    }
  }
}


class Monster {
  constructor(stage) {
    this.hp = 100;
    this.atk = 2;
    this.name = "Oak";
    this.stage = stage;
  }

  attack() {
    // 몬스터의 공격
    const damage = this.atk * this.stage;

    switch (true) {
      case damage > 0:
        // console.log(`${this.name}의 공격!!\n${damage}의 데미지가 들어갔습니다.`);
        return damage;
      default:
        console.log(`Miss`)
        return 0;
    }

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
      chalk.green(
        `\n1. 공격한다 2. 도망친다.`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리

    if (choice === "1") {
      const Attack = player.attack();
      monster.hp -= Attack;

      const MonAttack = monster.attack();
      player.hp -= MonAttack;



      // 체력 음수방지
      if (monster.hp < 0) monster.hp = 0;
      if (player.hp < 0) player.hp = 0;

      // 플레이어의 공격 구간 
      if (monster.hp > 0) {
        logs.push(chalk.green(`${player.character}가 ${monster.name}에게 ${Attack}데미지를 주었다!`));
      }

      // 몬스터의 공격 구간
      if (player.hp > 0) {
        logs.push(chalk.green(`${monster.name}가 ${player.character}에게 ${MonAttack}데미지를 주었다!`));
      }
    }
    else if (choice === "2") {
      console.log(chalk.green(`${monster.name}에게서 도망쳤다.`))
      readlineSync.question();
      return false;
    }

    // 로그 길이 제한 
    if (logs.length > 3) logs.shift();


    if (player.hp <= 0) {
      console.log(chalk.red("\n플레이어가 패배했습니다!"));
      return false; // 패배
    } else if (monster.hp <= 0) {
      console.log(chalk.yellow(`\n${monster.name}을 물리쳤습니다!`));
      return true; // 승리
    }


  }

}



export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    const result = await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건


    if (!result && player.hp<= 0) {
      console.log(chalk.red("게임 오버!"));
      break;
    }
    if (stage >= 10) {
      break;
    }

    if (monster.hp <= 0) {
      console.log(chalk.greenBright(`Stage ${stage} 클리어! 다음 스테이지로 이동!`));
      readlineSync.question();
      player.hp = 100;
      stage++;
    }

  }

  if (player.hp > 0 && stage >= 10) {
    console.log(chalk.greenBright("\n모든 스테이지를 클리어했습니다! 승리!"));
  }

}
