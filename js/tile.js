class Tile{
	constructor(x, y, spriteX, spriteY, passable){
        this.x = x;
        this.y = y;
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.passable = passable;
  }

    //manhattan distance
  dist(other){
    return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
  }
  
  getNeighbor(dx, dy){
    return getTile(this.x + dx, this.y + dy)
  }

  getAdjacentNeighbors(){
    return shuffle([
      this.getNeighbor(0, -1),
      this.getNeighbor(0, 1),
      this.getNeighbor(-1, 0),
      this.getNeighbor(1, 0)
    ]);
  }

  getAdjacentPassableNeighbors(){
    return this.getAdjacentNeighbors().filter(t => t.passable);
  } 

  getConnectedTiles(){
    let connectedTiles = [this];
    let frontier = [this];
    while(frontier.length){
      let neighbors = frontier.pop()
                          .getAdjacentPassableNeighbors()
                          .filter(t => !connectedTiles.includes(t));
      connectedTiles = connectedTiles.concat(neighbors);
      frontier = frontier.concat(neighbors);
    }
    return connectedTiles;
  }
   
	draw(){
        drawTileSprite(this.spriteX, this.spriteY, this.x, this.y);
  }
}

class Floor extends Tile{
  constructor(x,y){
      super(x, y, 6, 0, true);
  };
}

class Wall extends Tile{
  constructor(x, y){
      super(x, y, 2, 0, false);
  }
}