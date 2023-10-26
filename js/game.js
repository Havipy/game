"use strict";
class Game {

	constructor(options) {
		this.canvas = document.querySelector('.field');
		this.ctx = this.canvas.getContext('2d');
		this.tileSize = options.tileSize;
		this.rowsTilesCount = options.rowsTilesCount;
		this.columnsTilesCount = options.columnsTilesCount;
		this.gameState = 'title';
		this.map = new Map({ columnsTilesCount: this.columnsTilesCount, rowsTilesCount: this.rowsTilesCount });
		this.score = 0;
		this.player;
	}

	//Настройка размеров канваса
	setupCanvas() {
		this.canvas.width = this.tileSize * this.columnsTilesCount;
		this.canvas.height = this.tileSize * this.rowsTilesCount;
		this.canvas.style.width = this.canvas.width + 'px';
		this.canvas.style.height = this.canvas.height + 'px';
	}

	showTitle(title) {
		this.ctx.fillStyle = 'rgba(0,0,0,.75)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.gameState = 'title';
		this.drawText(title, 70, this.canvas.height / 2 - 50, 'white');

	}

	//Запуск игры
	startGame() {
		this.map.generateMap();
		this.player = new Player(this.map.getRandomThroughoutTile());
		this.gameState = 'running';
	}

	//Ход
	tick() {

		for (let i = this.map.enemies.length - 1; i >= 0; i--) {
			if (!this.map.enemies[i].dead) {
				this.map.enemies[i].update();
			} else {
				//Удаление мертвого противника
				this.map.enemies.splice(i, 1);
			}
		}
		//Завершение игры
		if (this.player.dead) {
			this.draw();
			this.showTitle('Быть воином - жить вечно');
		}
		console.log(this.map.enemies);
		if (this.map.enemies.length == 0) {
			this.draw();
			this.showTitle('Вы победили');
		}
	}

	draw() {
		if (this.gameState == 'running') {

			//Очистка канваса
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			//Отрисовка полей
			for (let i = 0; i < this.columnsTilesCount; i++) {
				for (let j = 0; j < this.rowsTilesCount; j++) {
					this.map.tiles[i][j].draw();
				}
			}

			//Отрисовка противников
			for (let i = 0; i < this.map.enemies.length; i++) {
				this.map.enemies[i].draw();
			}
			this.player.draw();
		}
	}
	drawSprite(sprite, x, y) {
		this.ctx.drawImage(
			sprite,
			x * this.tileSize,
			y * this.tileSize,
			this.tileSize,
			this.tileSize
		);
	}

	drawText(text, size, textY, color) {
		this.ctx.fillStyle = color;
		this.ctx.font = size + "px monospace";
		const textX = (this.canvas.width - this.ctx.measureText(text).width) / 2;
		this.ctx.fillText(text, textX, textY);
	}

}
