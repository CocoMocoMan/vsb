function generateLevel(){
  tryTo('generate map', function(){
    return generateTiles() == randomPassableTile().getConnectedTiles().length;
  });
  
  generateMonsters();
  generateItemDrops();
}

function generateTiles(){
  let passableTiles=0;
  tiles = [];
  for(let i=0;i<numTiles;i++){
      tiles[i] = [];
      for(let j=0;j<numTiles;j++){
          if(Math.random() < 0.3 || !inBounds(i,j)){
              tiles[i][j] = new Wall(i,j);
          }else{
              tiles[i][j] = new Floor(i,j);
              passableTiles++;
          }
      }
  }
  return passableTiles;
}

function inBounds(x,y){
  return x>0 && y>0 && x<numTiles-1 && y<numTiles-1;
}

function getTile(x, y){
  if(inBounds(x,y)){
      return tiles[x][y];
  }else{
      return new Wall(x,y);
  }
}

function randomPassableTile(){
  let tile;
  tryTo('get random passable tile', function(){
      let x = randomRange(0,numTiles-1);
      let y = randomRange(0,numTiles-1);
      tile = getTile(x, y);
      return tile.passable && !tile.monster;
  });
  return tile;
}

function generateMonsters(){
  monsters = [];
  let numRandomMonsters = level+1;
  for(let i=0;i<numRandomMonsters;i++){
      spawnRandomMonster();
  }
  spawnVampire();
}

function spawnRandomMonster(){
  let monsterType = shuffle([VampireLord, VampireQueen, Undead])[0];
  let monster = new monsterType(randomPassableTile());
  monsters.push(monster);
}

function spawnVampire() {
  let monsterType = shuffle([VampireLord, VampireQueen])[0];
  let monster = new monsterType(randomPassableTile());
  monsters.push(monster);
}

function vampireTilesRemaining() {
  let vampiresRemaining = 0;
  for(let i=0;i<numTiles;i++) {
    for(let j=0;j<numTiles;j++ ) {
      if (getTile(i,j).monster && getTile(i, j).monster.isVampire) vampiresRemaining++;
    }
  }
  return vampiresRemaining;
}

function generateItemDrops() {
  itemDrops = [];
  let numItemDrops = Math.max(Math.trunc(level/3)+1, (vampireTilesRemaining()/2)-1);
  for(let i=0;i<numItemDrops;i++){
      spawnItemDrop();
  }
}

function spawnItemDrop() {
  let itemDrop = new ItemDrop(randomPassableTile());
  itemDrops.push(itemDrop);
}