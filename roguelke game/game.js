import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.atk = 20;
    this.character = "Woorior";
  }

  attack() {
    // 플레이어의 공격
    // const bonus = Math.floor(Math.random() * 10) + 1;
    const damage = this.atk
    
    switch(true){
      case this.damage >= 0 :
        console.log(`${this.character}의 공격!!\n ${damage}의 데미지가 들어갔습니다.`);
        return this.damage;
      default :
        console.log(`Miss`)
        return 0;
     }
    }
  }


class Monster {
  constructor() {
    this.hp = 100;
    this.atk = 10;
    this.name = "Oak";
  }

  attack() {
    // 몬스터의 공격
    const damage = this.atk * stage ;
    
    switch(true){
      case this.damage >= 0 :
        console.log(`${this.name}의 공격!!/n ${damage}의 데미지가 들어갔습니다.`);
        return this.damage;
      default :
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

  while(player.hp > 0) {
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
    
    if(choice === "1" ) {  
      const attack = player.attack();
      monster.hp -= attack ;
      

      if(monster.hp > 0){
        logs.push(chalk.green(`${player.character}가 ${monster.name}에게 ${attack} 데미지를 주었다!`));
      } else {
        logs.push(chalk.green(`${player.character}가${monster.name}에게 ${attack} 데미지를 주었다!\n ${monster.name}를 물리쳤다.`));
        
      }
    } 
    if(choice === "2"){
       logs.push(chalk.green(`${monster.name}에게서 도망쳤다.`))
    } 
    
  }
  
}

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
}