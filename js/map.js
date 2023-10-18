
//Объявление переменных
const tiles = [];
let passableTiles = 0;

//Генерация карты
function generateMap() {
	attempTo('генерации карты', function () {
		passableTiles = 0;
		return generateTiles() == getRandomThroughoutTile().getConnectedTiles().length;
	});

	spawnEnamies();

	for (let i = 0; i < 2; i++) {
		getRandomThroughoutTile().sword = true;

	}

	for (let i = 0; i < 10; i++) {
		getRandomThroughoutTile().potion = true;

	}



}

//Генерация блоков
function generateTiles() {

	//Заполнение стеной всего поля
	for (let i = 0; i < columnTilesCount; i++) {
		tiles[i] = [];
		for (let j = 0; j < rowsTilesCount; j++) {
			tiles[i][j] = new Wall(i, j);
		}
	}

	//Создание стен
	const wallsCount = randomInteger(5, 10);
	const rects = [];
	for (let i = 0; i < wallsCount; i++) {
		createRoom(rects);
	}

	//Создание проходов
	const verticalLinesCount = randomInteger(3, 5);
	const horizontalLinesCount = randomInteger(3, 5);
	const horizontalLines = [];
	const verticalLines = [];

	for (let i = 0; i < horizontalLinesCount; i++) {
		createLines(horizontalLines, true);
	}
	for (let i = 0; i < verticalLinesCount; i++) {
		createLines(verticalLines, false);
	}

	return passableTiles;

}

//Проверка границ
function inBounds(x, y) {
	return x > 0 && y > 0 && x < columnTilesCount - 1 && y < rowsTilesCount - 1;
}

function getTile(x, y) {
	if (inBounds(x, y)) {
		return tiles[x][y];
	} else {
		return new Wall(x, y);
	}
}

//Функция для создания комнаты
function createRoom(rects) {

	const width = randomInteger(3, 8);
	const height = randomInteger(3, 8);
	const x = randomInteger(1, (columnTilesCount - width - 1));
	const y = randomInteger(1, (rowsTilesCount - height - 1));
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
				tiles[i][j] = new Floor(i, j);
				passableTiles++;
			}
		}
		return;
	}
	else {
		createRoom(rects);
	}

}

//Функция для создания прохода
function createLines(lines, horizontal) {

	let position = horizontal
		? randomInteger(1, (rowsTilesCount - 2))
		: randomInteger(1, (columnTilesCount - 2));

	let ok = true;

	lines.forEach((linePosition) => {
		if (Math.abs(linePosition - position) <= 1) {
			ok = false;
		}
	});

	if (ok) {
		lines.push(position);
		if (horizontal) {
			for (let i = 1; i < columnTilesCount - 1; i++) {
				if (tiles[i][position] instanceof Floor) {
					continue;
				}
				tiles[i][position] = new Floor(i, position);
				passableTiles++;
			}
		}
		else {
			for (let j = 1; j < rowsTilesCount - 1; j++) {
				if (tiles[position][j] instanceof Floor) {
					continue;
				}
				tiles[position][j] = new Floor(position, j);
				passableTiles++;
			}
		}
		return;
	}
	else {
		createLines(lines, horizontal)
	}
}

//Генерация противников
function spawnEnamies() {

	enemies = [];
	for (let i = 0; i < 10; i++) {
		const enemy = new Enemy(getRandomThroughoutTile());
		enemies.push(enemy);
	}

}

//Функция возвращающая любой свободный блок

function getRandomThroughoutTile() {

	let tile;
	attempTo('получения свободной клетки', function () {
		let x = randomInteger(0, columnTilesCount - 1);
		let y = randomInteger(0, rowsTilesCount - 1);
		tile = getTile(x, y);
		return tile.passable && !tile.character && !tile.potion && !tile.sword;
	});
	return tile;

}
