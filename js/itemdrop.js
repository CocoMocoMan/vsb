class ItemDrop {
  constructor(tile) {
    this.tile = tile;
    tile.itemDrop = this;
    this.spriteX = 0;
    this.spriteY = 8;
    this.loot = {
      stakes: 2,
      silverbullets: 0
    }
  }

  draw() {
    drawTileSprite(this.spriteX, this.spriteY, this.tile.x, this.tile.y);
  }

  remove() {
    this.tile.itemDrop = null; 
    this.spriteX = 6;
    this.spriteY = 0;
  }
}