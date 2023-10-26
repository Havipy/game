"use strict";

class Character {

	constructor(tile, sprite, hp) {
		this.move(tile);
		this.sprite = sprite;
		this.hp = hp;
	}

	//Передвинуть персонажа
	move(tile) {
		if (this.tile) {
			this.tile.character = null;
		}
		this.tile = tile;
		tile.character = this;
		tile.stepOnSword(this);
		tile.stepOnPotion(this);
	}

	//Проверка на возможность передвижения
	tryMove(dx, dy) {

		let newTile = this.tile.getNeighbor(dx, dy);

		if (newTile.passable) {
			if (!newTile.character) {
				this.move(newTile);
			}
			else {
				if (newTile.character.isPlayer) {
					newTile.character.hit(1);
				}
			}
			return true;
		}

		else {
			return this.stepOnInvisibleWall(newTile);
		}
	}

	stepOnInvisibleWall(newTile) {
		if (newTile instanceof InvisibleWall) {

			if (newTile.x < 0) {
				newTile = game.map.getTile(game.columnsTilesCount - 1, this.tile.y);
			}
			if (newTile.x > game.columnsTilesCount - 1) {
				newTile = game.map.getTile(0, this.tile.y);
			}
			if (newTile.y < 0) {
				newTile = game.map.getTile(this.tile.x, game.rowsTilesCount - 1);
			}
			if (newTile.y > rowsTilesCount - 1) {
				newTile = game.map.getTile(this.tile.x, 0);
			}
			this.move(newTile);
			return true;
		}
	}

	//Функция для поиска игрока противником
	doAction() {

		let neighbors = this.tile.getNearThroughoutNeighbors();
		neighbors = neighbors.filter(t => !t.character || t.character.isPlayer);

		if (neighbors.length) {

			//Поиск наиболее подходящей по расстоянию клетки
			neighbors.sort((a, b) => a.getDistanceBetweenTiles(game.player.tile) - b.getDistanceBetweenTiles(game.player.tile));

			let newTile = neighbors[0];

			this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
		}
	}

	//Функция для получения урона
	hit(damage) {
		this.hp -= damage;
		if (this.isPlayer && this.tile.potion) {

			this.tile.stepOnPotion(this);
		}
		if (this.hp <= 0) {
			this.die();
		}
	}

	die() {

		this.dead = true;
		this.tile.character = null;
		const newSprite = new Image();
		newSprite.src = 'images/tile-.png';
		this.sprite = newSprite;
	}

	drawHp() {
		game.ctx.fillStyle = !this.isPlayer ? "red" : "green";
		game.ctx.fillRect(this.tile.x * game.tileSize, this.tile.y * game.tileSize, this.hp * 4, 2.5);
	}

	//Отрисовка персонажа
	draw() {
		game.drawSprite(this.sprite, this.tile.x, this.tile.y);
		this.drawHp();
	}

}

class Enemy extends Character {

	constructor(tile) {
		const sprite = new Image();
		sprite.src = 'images/tile-E.png';
		super(tile, sprite, 6);
	}

	//Обновления состояния противника 
	update() {
		if (this.enemyStunned) {
			this.enemyStunned = false;
			return;
		}
		this.doAction();
	}
}


class Player extends Character {

	constructor(tile) {
		const sprite = new Image();
		sprite.src = 'images/tile-P.png';
		super(tile, sprite, 6);

		this.damage = 2;
		this.isPlayer = true;
	}

	attack() {

		// Нахождение ближайших противников
		const neighbors = this.tile.getNextNeighbors();
		const nearEnemies = neighbors.filter(t => t.character);
		if (nearEnemies.length >= 1) {
			nearEnemies.forEach(nearEnemy => {
				nearEnemy.character.hit(this.damage);
				//Оглушение противника
				if (Math.random() < 0.8) {
					if (nearEnemy.character) {
						nearEnemy.character.enemyStunned = true;
					}
				}
			});
			game.tick();
		}
	}

	tryMove(dx, dy) {
		if (super.tryMove(dx, dy)) {
			game.tick();
		}
	}
}
