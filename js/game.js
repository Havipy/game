
//Настройка размеров канваса
function setupCanvas() {
	canvas.width = tileSize * (columnTilesCount + uiWidth);
	canvas.height = tileSize * columnTilesCount;
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
}

function drawSprite(sprite, x, y) {
	ctx.drawImage(
		sprite,
		x * tileSize,
		y * tileSize,
		tileSize,
		tileSize
	);
}

//Ход
function tick() {
	for (let i = enemies.length - 1; i >= 0; i--) {
		if (!enemies[i].dead) {
			enemies[i].update();
		} else {
			//Удаление мертвого противника
			enemies.splice(i, 1);
		}
		draw();
	}
	if (player.dead) {

		showTitle();
	}
}

function draw() {
	if (gameState == "running") {
		//Очистка канваса
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//Отрисовка полей
		for (let i = 0; i < columnTilesCount + uiWidth; i++) {
			for (let j = 0; j < columnTilesCount; j++) {
				tiles[i][j].draw();
			}
		}

		//Отрисовка противников
		for (let i = 0; i < enemies.length; i++) {
			enemies[i].draw();
		}

		player.draw();

	}
}

//Заставка
function showTitle() {
	ctx.fillStyle = 'rgba(0,0,0,.75)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	gameState = "title";
}

//Запуск игры
function startGame() {
	generateMap();
	player = new Player(getRandomPassableTile());
	gameState = "running";
}
