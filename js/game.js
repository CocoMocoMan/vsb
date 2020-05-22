function setupCanvas(){
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  ctx.font = "16px Arial"

  canvas.width = tileSize*(numTiles+uiWidth);
  canvas.height = tileSize*numTiles;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  ctx.imageSmoothingEnabled = false;
}

function drawCharacterSprite(sprite, x, y){
  row = 0;
  if (sprite > 6) {
    sprite = sprite - 7;
    row = 1;
  }
  ctx.drawImage(
      characterspritesheet,
      sprite*16,
      row * 16,
      16,
      16,
      x*tileSize,
      y*tileSize,
      tileSize,
      tileSize
  );
}

function drawTileSprite(spriteX, spriteY, x, y) {
  ctx.drawImage(
    tilespritesheet,
    spriteX*16,
    spriteY*16,
    16,
    16,
    x*tileSize,
    y*tileSize,
    tileSize,
    tileSize
  );
}

function drawText(text, size, centered, textY, color){
  ctx.fillStyle = color;
  ctx.font = size + "px monospace";
  let textX;
  if(centered){
      textX = (canvas.width-ctx.measureText(text).width)/2;
  }else{
      textX = canvas.width-uiWidth*tileSize+25;
  }

  ctx.fillText(text, textX, textY);
}

function draw(){
  if (gameState == "running" || gameState == "dead"){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<numTiles;i++){
      for(let j=0;j<numTiles;j++){
          getTile(i,j).draw();
      }
    }

    for(let i=0;i<monsters.length;i++){
      monsters[i].draw();
    }

    for(let i=0; i<itemDrops.length;i++){
      itemDrops[i].draw();
    }

    player.draw();
    player.drawInventory();

    drawText("Level: "+level, 30, false, 40, "violet");
  }
}

function tick(){
  for(let k=monsters.length-1;k>=0;k--){
      if(!monsters[k].dead){
          monsters[k].update();
      }else{
          monsters.splice(k,1);
      }
  }
  if (player.dead){
    gameState = "dead";
  }
  if (vampireTilesRemaining() == 0) {
    level++;
    startLevel();
  }
}

function showTitle() {
  ctx.fillStyle = 'rgba(0,0,0,.75)';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  gameState = "title";

  drawText("VAMPIRE SLAYER", 40, true, canvas.height/2 - 110, "white");
  drawText("BROS.", 70, true, canvas.height/2 - 50, "white");
}

function startGame(){                                           
  level = 1;
  startLevel();

  gameState = "running";
}

function startLevel(){                          
  generateLevel();

  player = new Player(randomPassableTile());
  player.addStakes(2);
  player.addBeads(1);
}



