
 //Gamestates
 var PLAY = 2;
 var END = 1;
 var START = 0
 var gameState = START;
 var edges;
 var highScore;
 
 var ground,player,play;
 var invisible_ground,zombie;
 var zombie_image,bg,bg2,girl,play_img;
 
 var handImg,coinImg;
 var gameOver_img,restart_img,skull_img;
 var score=0;
 var HandGroup,CoinsGroup,SkullGroup;
 
 var point,levelup,growl,bgm,point2;
 function preload(){
 
   zombie_image=loadAnimation("images/zombie1.png","images/zombie2.png","images/zombie3.png",
                             "images/zombie4.png","images/zombie5.png","images/zombie6.png");
   girl=loadAnimation("images/girl1.png","images/girl2.png");
   bg=loadImage("images/bg.png");
   bg2=loadImage("images/bg2.png");
   handImg=loadImage("images/grave.png");
   coinImg=loadImage("images/coin.png");
   play_img=loadImage("images/youtube.png");
 
   gameOver_img=loadImage("images/game-over.png");
   restart_img=loadImage("images/restore.png");
   skull_img=loadImage("images/skull.png");
 
   point=loadSound("sounds/point.wav");
   point2=loadSound("sounds/point2.wav");
   levelup=loadSound("sounds/levelup.wav");
   growl=loadSound("sounds/zombiegrowl.wav");
   bgm=loadSound("sounds/bgm.wav");
 
 }
 function setup() {
 
   createCanvas(800, 500);
   edges=createEdgeSprites();
   ground=createSprite(500,-120,0,0);
   ground.scale=1.7;
   ground.x = ground.width /2;
   ground.velocityX = -4;
   ground.addImage(bg)
 
   invisible_ground=createSprite(400,470,800,10);
   invisible_ground.visible=false;
 
   player=createSprite(300,420,20,100);
   player.addAnimation("a",girl);
   player.scale=0.3;
 
   zombie=createSprite(150,410,20,100);
   zombie.scale=0.4;
   zombie.addAnimation("zom",zombie_image);
   zombie.setCollider("circle",0,0,1);
 
   play=createSprite(390,300);
   play.scale=0.2;
   play.addImage(play_img);
 
   gameOver = createSprite(400,80);
   gameOver.addImage(gameOver_img);
   gameOver.scale=0.15;
 
   restart = createSprite(400,200);
   restart.addImage(restart_img);
   restart.scale=0.2;
   
   //groups
   HandGroup=new Group();
   CoinsGroup=new Group();
   SkullGroup=new Group();
 
   score=0;
   highScore=0;
   bgm.loop();
 }  
 function draw() {
   background("black");
 
   if (gameState===START) {
     gameOver.visible=false;
     restart.visible=false;
     play.visible=true;
     ground.velocityX = -3;
     if (ground.x < 0){
       ground.x = ground.width/2;
     }
     player.collide(invisible_ground);
     zombie.collide(invisible_ground);
     player.collide(edges);
     if (mousePressedOver(play)) {
       gameState=PLAY;
       point2.play();
       point2.loop = false;
     } 
     }
 
     if (gameState===PLAY){
 
     //in playstate these arent required
     gameOver.visible=false;
     restart.visible=false;
     play.visible=false;
 
     //to increase speed with score
      ground.velocityX = -(4 + score/50);
 
     player.collide(invisible_ground);
    zombie.collide(invisible_ground);
     player.collide(edges);
 
     // infinite scrolling of ground
     if (ground.x < 0){
      ground.x = ground.width/2;
     }
 
     // gravity for player and movements
     if(keyDown("space")&& player.y >= 220) {
      player.velocityY = -10;  
     }  
     if(keyDown("left")) {
      player.x-=2;
     }  
     if(keyDown("right")) {
      player.x+=2;
     }
    player.velocityY = player.velocityY + 0.8;
   
 
    spawnhands();
    spawnCoins();
 
    //Level 1
    if (score>200) {    
      level1();    
    }
    if (score===200) {    
      levelup.play();
      levelup.loop = false;  
    }
    //Level 2
    if (score>=400) {    
      level2();
    }
    if (score===400) {    
      levelup.play();
      levelup.loop = false;  
    }
    //Level 3
    if (score>700) {
      level3();
    }
    if (score===700) {    
      levelup.play();
      levelup.loop = false;  
    }
    //Level 4
    if (score>1000) {
      level4();
    }
    if (score===1000) {    
      levelup.play();
      levelup.loop = false;  
    }
    //Level 5
    if (score>1500) {
      level5();
    }
    if (score===1500) {    
      levelup.play();
      levelup.loop = false;  
    }
    //scoring 
    if(player.isTouching(CoinsGroup)){
      player.velocityY=3;
      score=score+5;
      point.play();
      CoinsGroup.setVisibleEach(false);
    }
 
    if (player.isTouching(HandGroup)){
      gameState=END;
      growl.play();
    }
    if (player.isTouching(SkullGroup)){
      gameState=END;
      growl.play();
    }
    if (player.isTouching(zombie)){
      gameState=END;
      growl.play();
    }
  }
 
   else if ( gameState===END) {
   
    player.visible=false;
 
    bgm.stop();
 
    if (score>highScore){
     highScore=score;
    }
 
    //we need them in endstate 
    gameOver.visible=true;
    restart.visible=true;
 
    ground.velocityX = 0;
    player.velocityY = 0;
 
    console.log("gameover");
    //CAPTURED
    zombie.x=player.x;
    player.y=zombie.y;
 
     //set lifetime of the game objects so that they are never destroyed
     HandGroup.setLifetimeEach(-1);
     HandGroup.setVelocityXEach(0);
 
     CoinsGroup.destroyEach();
     CoinsGroup.setVelocityXEach(0);
 
     SkullGroup.destroyEach();
     SkullGroup.setVelocityYEach(0);
 
     //to restart game
     if(mousePressedOver(restart)) {
       reset();
     }
   }
 
   drawSprites();
   fill("white");
   text("SCORE : "+score,700,100);
   text("HIGHSCORE : "+highScore,680,120);
 }  
 
  
 
 
 // to spawn hands on ground
 function spawnhands() {
   if (frameCount % 120 === 0){
     var hand = createSprite(800,450,10,40);
     hand.addImage("hand",handImg);
     hand.scale=0.14
     hand.velocityX = -(4 + score/50);
     hand.lifetime=200;
     HandGroup.add(hand);
     hand.setCollider("circle",0,0,1);
     } 
   }
 //to spaw coins for score
 function spawnCoins() {
   if (frameCount % 100 === 0){
     var coin = createSprite(800,random(200,350),10,40);
     coin.velocityX = -6;
     coin.addImage(coinImg)
     coin.scale=0.06;
     coin.lifetime=130;
     CoinsGroup.add(coin);
     coin.setCollider("circle",0,0,1);
     }
   }
   
 
   // to resey the game and play again
 function reset(){
   gameState=START;
   player.visible=true;
   gameOver.visible=false;
   restart.visible=false;
   HandGroup.destroyEach();
   score=0;
   zombie.x=150;
   player.x=300;
   player.y=420;
   zombie.y=410;
   ground.addImage(bg);
   bgm.play();
   }
 
 function level1() {
   if (frameCount % 120 === 0){
     var skull = createSprite(random(0,800),50,10,40);
     skull.velocityY = 6;
     skull.addImage(skull_img)
     skull.scale=0.1;
     skull.lifetime=200;
     SkullGroup.add(skull);
     skull.setCollider("circle",0,0,1);
     }
 }  
 
 function level2() {
   ground.addImage(bg2);
   SkullGroup.collide(invisible_ground);
 }
 
 function level3() {
   ground.addImage(bg);
   SkullGroup.collide(invisible_ground);
   SkullGroup.bounceOff(invisible_ground);
   spawnhands2();
 }
 
 function level4() {
   ground.addImage(bg2);
   spawnhands3();
 }
 
 function level5() {
   ground.addImage(bg);
   spawnSkulls2();
 }
 
 function spawnhands2() {
   if (frameCount % 80 === 0){
     var hand = createSprite(800,450,10,40);
     hand.addImage("hand",handImg);
     hand.scale=0.14
     hand.velocityX = -(4 + score/50);
     hand.lifetime=200;
     HandGroup.add(hand);
     hand.setCollider("circle",0,0,1);
   } 
 }
 
 function spawnhands3() {
   if (frameCount % 50 === 0){
     var hand = createSprite(800,450,10,40);
     hand.addImage("hand",handImg);
     hand.scale=0.14
     hand.velocityX = -(4 + score/50);
     hand.lifetime=200;
     HandGroup.add(hand);
     hand.setCollider("circle",0,0,1);
   } 
 }
 
 function spawnSkulls2() {
   if (frameCount % 80 === 0){
     var skull = createSprite(random(0,800),50,10,40);
     skull.velocityY = 6;
     skull.addImage(skull_img)
     skull.scale=0.1;
     skull.lifetime=200;
     SkullGroup.add(skull);
     skull.setCollider("circle",0,0,1);
     }
 }