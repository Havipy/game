"use strict";

class Map {

	constructor(options) {
		this.columnsTilesCount = options.columnsTilesCount;
		this.rowsTilesCount = options.rowsTilesCount;
		this.tiles = [];
		this.passableTiles = 0;
		this.enemies = [];
	}
	//Функция возвращающая любой свободный блок

	getRandomThroughoutTile() {

		let tile;

		attempTo('получения свободной клетки', function () {
			const x = randomInteger(0, this.columnsTilesCount - 1);
			const y = randomInteger(0, this.rowsTilesCount - 1);
			tile = this.getTile(x, y);
			return tile.passable && !tile.character && !tile.potion && !tile.sword;
		}.bind(this));

		return tile;

	}
	generateMap() {

		attempTo('генерации карты', function () {
			this.passableTiles = 0;
			return this.generateTiles() === this.getRandomThroughoutTile().getConnectedTiles().length;
		}.bind(this));

		this.spawnEnamies();

		for (let i = 0; i < 2; i++) {
			this.getRandomThroughoutTile().sword = true;
		}

		for (let i = 0; i < 10; i++) {
			this.getRandomThroughoutTile().potion = true;
		}
		for (let i = 0; i < 3; i++) {
			this.getRandomThroughoutTile().treasure = true;
		}
	}

	//Генерация блоков
	generateTiles() {

		this.passableTiles = 0;
		//Заполнение стеной всего поля

		for (let i = 0; i < this.columnsTilesCount; i++) {
			this.tiles[i] = [];
			for (let j = 0; j < this.rowsTilesCount; j++) {

				this.tiles[i][j] = new Wall(i, j);

			}
		}


		//Создание стен
		const wallsCount = randomInteger(5, 10);
		const rects = [];

		for (let i = 0; i < wallsCount; i++) {
			this.createRoom(rects);
		}

		//Создание проходов
		const verticalLinesCount = randomInteger(3, 5);
		const horizontalLinesCount = randomInteger(3, 5);
		const horizontalLines = [];
		const verticalLines = [];

		for (let i = 0; i < horizontalLinesCount; i++) {
			this.createLines(horizontalLines, true);
		}
		for (let i = 0; i < verticalLinesCount; i++) {
			this.createLines(verticalLines, false);
		}

		return this.passableTiles;

	}

	//Проверка границ
	inBounds(x, y) {
		return x >= 0 && y >= 0 && x < this.columnsTilesCount && y < this.rowsTilesCount;
	}

	getTile(x, y) {
		if (this.inBounds(x, y)) {
			return this.tiles[x][y];
		} else {
			return new InvisibleWall(x, y);
		}

	}
	//Функция для создания комнаты
	createRoom(rects) {

		const width = randomInteger(3, 8);
		const height = randomInteger(3, 8);
		const x = randomInteger(1, (this.columnsTilesCount - width - 1));
		const y = randomInteger(1, (this.rowsTilesCount - height - 1));
		const rect =
		{
			x,
			y,
			w: width,
			h: height
		}

		let ok = true;

		rects.forEach((item) => {
			if (isCollide(rect, item)) {
				ok = false;
			}
		})

		if (ok) {
			rects.push(rect);
			for (let i = x; i < x + width; i++) {
				for (let j = y; j < y + height; j++) {
					this.tiles[i][j] = new Floor(i, j);
					this.passableTiles++;
				}
			}

			return;
		}
		else {
			this.createRoom(rects);
		}

	}

	//Функция для создания прохода
	createLines(lines, horizontal) {

		const position = horizontal
			? randomInteger(1, (this.rowsTilesCount - 2))
			: randomInteger(1, (this.columnsTilesCount - 2));

		let ok = true;

		lines.forEach((linePosition) => {
			if (Math.abs(linePosition - position) <= 1) {
				ok = false;
			}
		});

		if (ok) {
			lines.push(position);
			if (horizontal) {

				for (let i = 0; i < this.columnsTilesCount; i++) {

					if (this.tiles[i][position] instanceof Floor) {
						continue;
					}

					this.tiles[i][position] = new Floor(i, position);
					this.passableTiles++;
				}
			}

			else {
				for (let j = 0; j < this.rowsTilesCount; j++) {
					if (this.tiles[position][j] instanceof Floor) {
						continue;
					}
					this.tiles[position][j] = new Floor(position, j);
					this.passableTiles++;
				}
			}
			return;
		}
		else {
			this.createLines(lines, horizontal)
		}
	}

	//Генерация противников
	spawnEnamies() {
		this.enemies = [];
		for (let i = 0; i < 10; i++) {
			const enemy = new Enemy(this.getRandomThroughoutTile());
			this.enemies.push(enemy);
		}
	}

}
