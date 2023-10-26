"use strict";

class Tile {

	constructor(x, y, sprite, passable) {
		this.x = x;
		this.y = y;
		this.passable = passable;
		this.sprite = sprite;
	}

	getDistanceBetweenTiles(other) {
		return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
	}

	getNeighbor(dx, dy) {
		return game.map.getTile(this.x + dx, this.y + dy);
	}

	getNextNeighbors() {
		return [
			this.getNeighbor(0, -1),
			this.getNeighbor(0, 1),
			this.getNeighbor(-1, 0),
			this.getNeighbor(1, 0)
		];
	}

	getNearThroughoutNeighbors() {
		return this.getNextNeighbors().filter(t => t.passable);
	}

	getConnectedTiles() {
		let connectedTiles = [this];
		let stack = [this];
		let count = 0;
		while (stack.length) {
			count++;
			let neighbors = stack.pop()
				.getNearThroughoutNeighbors()
				.filter(t => !connectedTiles.includes(t));
			connectedTiles = [...connectedTiles, ...neighbors];
			stack = [...stack, ...neighbors];
		}
		console.log(count)
		return connectedTiles;
	}

	draw() {
		game.drawSprite(this.sprite, this.x, this.y);
		if (this.potion) {
			const potionSprite = new Image();
			potionSprite.src = 'images/tile-HP.png';
			game.drawSprite(potionSprite, this.x, this.y);
		}
		if (this.sword) {
			const swordSprite = new Image();
			swordSprite.src = 'images/tile-SW.png';
			game.drawSprite(swordSprite, this.x, this.y);
		}


	}
}

class Floor extends Tile {
	constructor(x, y) {
		const sprite = new Image();
		sprite.src = 'images/tile-.png';
		super(x, y, sprite, true);
	}

	stepOnSword(character) {
		if (character.isPlayer && this.sword) {
			character.damage += 2;
			this.sword = false;
		}
	}

	stepOnPotion(character) {
		if (character.isPlayer && this.potion) {
			if (character.hp < 6) {
				character.hp = 6;
				this.potion = false;
			}
		}
	}
}

class Wall extends Tile {
	constructor(x, y) {
		const sprite = new Image();
		sprite.src = 'images/tile-W.png';
		super(x, y, sprite, false);
	}
}

class InvisibleWall {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.passable = false;
	}
}