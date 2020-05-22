class Monster{
	constructor(tile, sprite){
    this.move(tile);
    this.sprite = sprite;
  }
  
  update() {
    this.doStuff();
  }

  doStuff() {
    let neighbors = this.tile.getAdjacentPassableNeighbors();
       
    neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

    if(neighbors.length){
      neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
      let newTile = neighbors[0];
      this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
    }
  }

	draw(){
    drawCharacterSprite(this.sprite, this.tile.x, this.tile.y);
  }
  
  tryMove(dx, dy){
    let newTile = this.tile.getNeighbor(dx,dy);
    if(newTile.passable){
      if(!newTile.monster){
        this.move(newTile);
      } 
      else{
        if(this.isPlayer != newTile.monster.isPlayer){
            newTile.monster.hit();
        }
      }
      return true;
    }
  }

  hit() {
    this.die();
  }

  die() {
    if (this.praying) return;
    this.dead = true;
    this.tile.monster = null;
    this.sprite = 1;
  }

  move(tile){
    if(this.tile){
      this.tile.monster = null;
    }
    this.tile = tile;
    tile.monster = this;
  }  
}

class Player extends Monster{
  constructor(tile){
    super(tile, 2);
    this.isPlayer = true;
    this.noise = 1;
    this.inventory = {
      stakes: 0,
      beads: 0,
      bullets: 0
    };
  }

  tryMove(dx, dy){
    let newTile = this.tile.getNeighbor(dx,dy);
    if(newTile.passable){
      if(!newTile.monster){
        if (newTile.itemDrop) {
          this.addStakes(newTile.itemDrop.loot.stakes);
          newTile.itemDrop.remove();
        }
        this.move(newTile);
      } 
      else{
        this.useStake(newTile);
      }
      tick();
      return true;
    }
  }

  //inventory
  drawInventory() {
    drawText("Stakes: "+this.inventory.stakes, 20, false, 80, "gold");
    drawText("Prayer Beads: "+this.inventory.beads, 20, false, 110, "black");
    drawText("Silver Bullets: "+this.inventory.bullets, 20, false, 140, "silver");
  }

  addStakes(amount) {
    this.inventory.stakes += amount;
  } 

  addBeads(amount) {
    this.inventory.beads += amount;
  }

  addBullets(amount) {
    this.inventory.bullets += amount;
  }

  //item actions
  useStake(newTile) {
    if(this.inventory.stakes!=0){
      newTile.monster.hit();
      this.inventory.stakes--;
    }
  }

  useBead() {
    if (this.inventory.beads!=0) {
      this.praying = true;
      tick();
      this.praying = false;
      this.inventory.beads--;
    }
  }
}

class Vampire extends Monster{
  constructor(tile, sleepSprite, awakeSprite){
    super(tile, sleepSprite)
    this.isVampire = true;
    this.awake = false;
    this.awakeSprite = awakeSprite;
    this.sleepSprite = sleepSprite;
  }

  update() {
    super.update();
    if (this.awake) this.sprite = this.awakeSprite;
    else this.sprite = this.sleepSprite;
  }

  doStuff() {
    if (this.awake) {
      super.doStuff();
    }
    if (this.tile.dist(player.tile) <= player.noise) {
      this.awake = true;
    }
  }
}

class VampireLord extends Vampire{
  constructor(tile){
    super(tile, 8, 10)
  }
}

class VampireQueen extends Vampire{
  constructor(tile){
    super(tile, 7, 9)
  }
}

class Undead extends Monster{
  constructor(tile){
    super(tile, 11, 1)
  }
}