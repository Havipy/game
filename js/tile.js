class Tile {

	constructor(x, y, sprite, passable) {
		this.x = x;
		this.y = y;
		this.passable = passable;
		this.sprite = sprite;
	}
	dist(other) {
		return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
	}

	getNeighbor(dx, dy) {
		return getTile(this.x + dx, this.y + dy)
	}

	getNextNeighbors() {
		return shuffle([
			this.getNeighbor(0, -1),
			this.getNeighbor(0, 1),
			this.getNeighbor(-1, 0),
			this.getNeighbor(1, 0)
		]);
	}

	getNextPassableNeighbors() {
		return this.getNextNeighbors().filter(t => t.passable);
	}
	getConnectedTiles() {
		let connectedTiles = [this];

		let frontier = [this];
		while (frontier.length) {

			let neighbors = frontier.pop()
				.getNextPassableNeighbors()
				.filter(t => !connectedTiles.includes(t));

			connectedTiles = connectedTiles.concat(neighbors);
			frontier = frontier.concat(neighbors);
		}
		return connectedTiles;
	}
	draw() {
		drawSprite(this.sprite, this.x, this.y);
	}
}
class Floor extends Tile {
	constructor(x, y) {

		const sprite = new Image();
		sprite.src = 'images/tile-.png';
		super(x, y, sprite, true);

	}
}
class Wall extends Tile {
	constructor(x, y) {
		const sprite = new Image();
		sprite.src = 'images/tile-w.png';
		super(x, y, sprite, false);
	}
}
