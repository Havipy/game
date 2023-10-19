const game = {
	//Настройка размеров канваса
	setupCanvas() {
		canvas.width = tileSize * columnsTilesCount;
		canvas.height = tileSize * rowsTilesCount;
		canvas.style.width = canvas.width + 'px';
		canvas.style.height = canvas.height + 'px';
	},

	drawSprite(sprite, x, y) {
		ctx.drawImage(
			sprite,
			x * tileSize,
			y * tileSize,
			tileSize,
			tileSize
		);
	},

	//Ход
	tick() {
		for (let i = enemies.length - 1; i >= 0; i--) {
			if (!enemies[i].dead) {
				enemies[i].update();
			} else {
				//Удаление мертвого противника
				enemies.splice(i, 1);
			}
		}
		//Завершение игры
		if (player.dead) {
			this.draw();
			this.showTitle('Быть воином - жить вечно');
		}
		if (enemies.length == 0) {
			this.draw();
			this.showTitle('Вы победили');
		}
	},

	draw() {
		if (gameState == 'running') {
			//Очистка канваса
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			//Отрисовка полей
			for (let i = 0; i < columnsTilesCount; i++) {
				for (let j = 0; j < rowsTilesCount; j++) {
					tiles[i][j].draw();
				}
			}
			//Отрисовка противников
			for (let i = 0; i < enemies.length; i++) {
				enemies[i].draw();
			}
			player.draw();
		}
	},

	//Заставка
	showTitle(title) {
		console.log(1);
		ctx.fillStyle = 'rgba(0,0,0,.75)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		gameState = "title";
		this.drawText(title, 70, true, canvas.height / 2 - 50, "white");
	},

	drawText(text, size, centered, textY, color) {
		ctx.fillStyle = color;
		ctx.font = size + "px monospace";
		let textX;
		textX = (canvas.width - ctx.measureText(text).width) / 2;
		ctx.fillText(text, textX, textY);
	},

	//Запуск игры
	startGame() {
		generateMap();
		player = new Player(getRandomThroughoutTile());
		gameState = "running";
	},

}
