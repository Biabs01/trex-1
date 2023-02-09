var PLAY = 1;
var END = 0;
var estadoDeJogo = PLAY;
var trex, trex_correndo, trex_colidindo;
var chao, chaoImagem, chaoInvisivel;
var nuvens;
var obstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var pontos;
var gameOverImg, restartImg;
var jumpSom, dieSom, checkPointSom; 

function preload() {
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_colidindo = loadAnimation("trex_collided.png");
  
  chaoImagem = loadImage("ground2.png");
  
  nuvemImagem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSom = loadSound("jump.mp3");
  checkPointSom = loadSound("checkPoint.mp3");
  dieSom = loadSound("die.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //criando o trex
  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("colidiu", trex_colidindo)
  trex.scale = 0.5;
  trex.x = 50;
  
  //criando o chao
  chao = createSprite(width/2, height - 70, width, 2);
  chao.addImage("chao", chaoImagem);
  chao.x = chao.width/2;

  //criando chao invísivel
  chaoInvisivel = createSprite(width/2, height - 10, width, 125);
  chaoInvisivel.visible = false;

  gameOver = createSprite(width/2, height/2 - 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  grupoCactos = new Group();
  grupoNuvens = new Group();

  pontos = 0;

}

function draw() {
  background(180);
  text("Pontuação: " + pontos, 30, 50);

  trex.setCollider("rectangle", 0, 0,100,trex.height);
  trex.debug = true;

  if(estadoDeJogo === PLAY){
    pontos = pontos + Math.round(getFrameRate()/60);
    if(pontos > 0 && pontos % 100 === 0){
      checkPointSom.play();
    }

    chao.velocityX = -(5 + 3*pontos/100);
    
    gameOver.visible = false;
    restart.visible = false;

    if (chao.x < 0){
      chao.x = chao.width/2; 
    }

    if(touches.length > 0 || keyDown("space") && trex.y >= height-120)
    {
      trex.velocityY = -10;
      jumpSom.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.5;

    criarNuvens();
  
    criarObstaculos();
    if(grupoCactos.isTouching(trex)){
      estadoDeJogo = END;
      dieSom.play();
    }
  }
  else if(estadoDeJogo === END){
    chao.velocityX = 0;
    
    gameOver.visible = true;
    restart.visible = true;

    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    
    trex.velocityY = 0;
    trex.changeAnimation("colidiu", trex_colidindo);

    if(mousePressedOver(restart)){
      reset();
    }
  }

  trex.collide(chaoInvisivel);
  
  drawSprites();
}

function criarNuvens(){
  if(frameCount % 60 === 0) {
    nuvens = createSprite(width+20, height-300, 40, 10);
    nuvens.addImage(nuvemImagem);
    nuvens.y = Math.round(random(100, 220));
    nuvens.scale = 0.4;
    nuvens.velocityX = -3;

    nuvens.lifetime = 200;

    nuvens.depth = trex.depth;
    trex.depth = trex.depth + 1;

    grupoNuvens.add(nuvens);
  }
}

function criarObstaculos(){
  if(frameCount % 60 === 0) {
    obstaculos = createSprite(600, height-85, 10, 40);
    obstaculos.velocityX = -(5 + 3*pontos/100);00000000

    var aleatorio = Math.round(random(1,6));
    switch(aleatorio) {
      case 1: obstaculos.addImage(obstaculo1);
      break;
      case 2: obstaculos.addImage(obstaculo2);
      break;
      case 3: obstaculos.addImage(obstaculo3);
      break;
      case 4: obstaculos.addImage(obstaculo4);
      break;
      case 5: obstaculos.addImage(obstaculo5);
      break;
      case 6: obstaculos.addImage(obstaculo6);
      break;
      default: break;
    }

    obstaculos.scale = 0.5;
    obstaculos.lifetime = 300;
    obstaculos.depth = restart.depth;
    restart.depth = restart.depth + 1;

    grupoCactos.add(obstaculos);
  }
}

function reset(){
  estadoDeJogo = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  grupoCactos.destroyEach();
  grupoNuvens.destroyEach();

  trex.changeAnimation("correndo", trex_correndo);
  pontos = 0;
}