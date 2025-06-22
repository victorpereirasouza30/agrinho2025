let collector;
let trash = [];
let trees = [];
let score = 0;
let energy = 100;
let gameSpeed = 1;
let lastTrashSpawn = 0;
let gameStarted = false;

function setup() {
  createCanvas(600, 800);
  textSize(32);
  textAlign(CENTER, CENTER);
  
  // Criar personagem coletor (usando emoji)
  collector = {
    x: width / 2,
    y: height - 100,
    size: 50,
    speed: 5,
    draw: function() {
      text('🧹', this.x, this.y);
    }
  };
  
  // Criar árvores no cenário (usando emojis)
  for (let i = 0; i < 10; i++) {
    trees.push({
      x: random(width),
      y: random(height - 200, height - 50),
      size: random(40, 80),
      type: random(['🌲', '🌳', '🌴', '🎄'])
    });
  }
}

function draw() {
  background('#8ab6d6'); // Céu azul claro
  
  // Desenhar gramado
  fill('#4CAF50');
  noStroke();
  rect(0, height - 50, width, 50);
  
  // Desenhar árvores
  for (let tree of trees) {
    textSize(tree.size);
    text(tree.type, tree.x, tree.y);
  }
  
  // Desenhar informações do jogo
  drawGameInfo();
  
  if (gameStarted) {
    // Atualizar e desenhar lixos
    for (let i = trash.length - 1; i >= 0; i--) {
      trash[i].y += trash[i].speed * gameSpeed;
      textSize(trash[i].size);
      text(trash[i].type, trash[i].x, trash[i].y);
      
      // Verificar colisão com o coletor
      if (dist(trash[i].x, trash[i].y, collector.x, collector.y) < 25) {
        score += trash[i].value;
        energy = min(100, energy + 5); // Recupera um pouco de energia ao coletar
        trash.splice(i, 1);
        
        // Efeito visual de coleta
        fill(255, 215, 0);
        ellipse(collector.x, collector.y - 30, 20, 20);
      } 
      // Verificar se o lixo passou do coletor
      else if (trash[i].y > height) {
        energy -= 10; // Perde energia se o lixo não for coletado
        trash.splice(i, 1);
        
        // Efeito visual de perda
        fill(255, 0, 0, 100);
        rect(0, height - 50, width, 50);
      }
    }
    
    // Gerar novos lixos
    if (millis() - lastTrashSpawn > 1000 / gameSpeed) {
      spawnTrash();
      lastTrashSpawn = millis();
    }
    
    // Aumentar dificuldade
    gameSpeed = 1 + score / 500;
  } else {
    // Tela inicial
    drawStartScreen();
  }
  
  // Desenhar coletor
  textSize(collector.size);
  collector.draw();
  
  // Mover coletor com teclado
  if (keyIsDown(LEFT_ARROW)) {
    collector.x -= collector.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    collector.x += collector.speed;
  }
  
  // Limitar movimento do coletor
  collector.x = constrain(collector.x, 30, width - 30);
  
  // Verificar fim de jogo
  if (energy <= 0) {
    gameOver();
  }
}

function drawGameInfo() {
  fill(0);
  textSize(20);
  textAlign(LEFT);
  text(`Pontuação: ${score}`, 20, 30);
  text(`Energia: ${max(0, energy)}%`, 20, 60);
  
  // Barra de energia
  noStroke();
  fill(255, 0, 0, 100);
  rect(120, 45, 200 * (energy/100), 10);
  stroke(0);
  noFill();
  rect(120, 45, 200, 10);
}

function drawStartScreen() {
  fill(0, 0, 0, 180);
  rect(width/2 - 200, height/2 - 150, 400, 300, 20);
  
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('♻️ Coleta Ecológica', width/2, height/2 - 80);
  textSize(20);
  text('Colete o máximo de lixo possível!', width/2, height/2 - 30);
  text('Use as setas para se mover', width/2, height/2 + 10);
  textSize(24);
  text('Pressione Espaço para começar', width/2, height/2 + 80);
}

function gameOver() {
  gameStarted = false;
  score = 0;
  energy = 100;
  gameSpeed = 1;
  trash = [];
}

function spawnTrash() {
  const trashTypes = [
    { type: '🍂', value: 1, speed: 2, size: 30 },  // Folhas
    { type: '🥤', value: 2, speed: 3, size: 30 },  // Copo
    { type: '📰', value: 3, speed: 2.5, size: 30 }, // Jornal
    { type: '🍌', value: 1, speed: 3, size: 30 },   // Casca de banana
    { type: '🔋', value: 5, speed: 4, size: 25 },  // Bateria (mais pontos)
    { type: '💀', value: -10, speed: 5, size: 30 } // Item perigoso (perde pontos)
  ];
  
  const typeIndex = floor(random(trashTypes.length));
  const selectedType = trashTypes[typeIndex];
  
  trash.push({
    x: random(50, width - 50),
    y: -30,
    type: selectedType.type,
    value: selectedType.value,
    speed: selectedType.speed,
    size: selectedType.size
  });
}

function keyPressed() {
  if (key === ' ' && !gameStarted) {
    gameStarted = true;
  }
}
