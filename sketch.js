var trex, treximage, trexcollide;
var ground, groundimage;
var invisibleground;
var clouds, cloudimage;
var obstacle,
  obstacleImage1,
  obstacleImage2,
  obstacleImage3,
  obstacleImage4,
  obstacleImage5,
  obstacleImage6;

var Play = 0;
var End = 1;
var score = 0;
var gameState = Play;

var gameOver, gameOverImage;
var restart, restartImage;

var Gameover;
var restart;

var checkpointsound, diesound, jumpsound;
localStorage["HighestScore"] = 0;

function preload() {
  treximage = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  trexcollide = loadAnimation("trex_collided.png");
  checkpointsound = loadSound("checkpoint (1).mp3");
  diesound = loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");
}

function setup() {
  invisibleground;
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(62, height-100, 20, 20);
  trex.addAnimation("trex", treximage);
  trex.addAnimation("trexcollided", trexcollide);
  trex.scale = 0.5;

  ground = createSprite(500, height-50, 1000, 20);
  ground.addImage("ground2", groundimage);

  invisibleground = createSprite(500, height-40, 1000, 20);
  invisibleground.visible = false;

  obstacleGroup = new Group();
  cloudsGroup = new Group();

  Gameover = createSprite(width/2, height/2, 200, 20);
  Gameover.addAnimation("gameOver", gameOverImage);
  Gameover.scale = 0.5;

  restart = createSprite(width/2, height/2+50, 270, 20);
  restart.addAnimation("restart", restartImage);
  restart.scale = 0.5;

  trex.debug = false;

  trex.setCollider("rectangle", 0, 5);
}

function draw() {
  background("white");

  text(mouseX + " " + mouseY, mouseX, mouseY);

  text("Score:  " + score, width/4+100, height/2+15);
  fill("Black")
  text("HighestScore :" + localStorage["HighestScore"], width/4-100, height/2+15);
  
  textStyle("Bold")
  if (gameState === Play) {
    Gameover.visible = false;
    restart.visible = false;

    score = score + Math.round(frameCount % 5 === 0);

    if (keyDown("space") && trex.y >= height-140) {
      trex.velocityY = -6
      jumpsound.play()
    }
    else if(touches.length>0 && trex.y >= height-140 ){
      trex.velocityY = -6
      jumpsound.play()
      touches=[]
 
    }

    trex.velocityY = trex.velocityY + 0.5;
    ground.velocityX = -(4 + score / 100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (trex.isTouching(obstacleGroup)) {
      gameState = End;
      diesound.play();
      trex.changeAnimation("trexcollided", trexcollide);
    }
    spawncloud();
    spawnObstacle();

    if (score > 0 && score % 100 === 0) {
      checkpointsound.play();
    }
  } else if (gameState === End) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    Gameover.visible = true;
    restart.visible = true;

    cloudsGroup.setLifetimeEach(10);
    obstacleGroup.setLifetimeEach(10);

    cloudsGroup.setLifetimeEach(30);

    obstacleGroup.setLifetimeEach(30);

    if (mousePressedOver(restart)) {
      restartGame();
    }
    if (touches.length> 0 || mousePressedOver(restart)) {
      restartGame()
      touches=[]
    }

  }

  trex.collide(invisibleground);

  drawSprites();
}

function spawncloud() {
  if (frameCount % 80 === 0) {
    clouds = createSprite(width+400, height+100, 120, 20);
    clouds.addImage("clouds", cloudimage);
    clouds.velocityX = -5;
    clouds.y = Math.round(random((height-300,(height-400)), 350));

    clouds.depth = trex.depth;
    trex.depth += 1;

    clouds.lifetime = width/6;

    cloudsGroup.add(clouds);
  }
}

function spawnObstacle() {
  if (frameCount % 80 === 0) {
    Obstacle = createSprite(880, height-75, 10, 70);
    Obstacle.velocityX = -(6 + score / 100);
    Obstacle.scale = 0.7;

    var rand = Math.round(random(1, 6));
    obstacleGroup.add(Obstacle);
    switch (rand) {
      case 1:
        Obstacle.addImage(obstacleImage1);
        break;
      case 2:
        Obstacle.addImage(obstacleImage2);
        break;
      case 3:
        Obstacle.addImage(obstacleImage3);
        break;
      case 4:
        Obstacle.addImage(obstacleImage4);
        break;
      case 5:
        Obstacle.addImage(obstacleImage5);
        break;
      case 6:
        Obstacle.addImage(obstacleImage6);
        break;
      default:
        break;
    }
  }
}

// ctrl shift p for prettier

function restartGame() {
  gameState = Play;
  obstacleGroup.destroyEach();
  
  trex.changeAnimation("trex", treximage);
  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }
  score = 0;
}
