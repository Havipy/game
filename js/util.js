//Функция обертка для проверки лимита попыток выполнения колбэка
function attempTo(description, callback) {
	for (let attempts = 1000; attempts > 0; attempts--) {
		if (callback()) {
			return;
		}
	}
	throw 'Превышение попыток во время ' + description;
}

function randomInteger(min, max) {
	let rand = min + Math.random() * (max - min);
	return Math.round(rand);
}

//Функция для перетасовки элементов массива
function shuffle(arr) {
	let temp, r;
	for (let i = 1; i < arr.length; i++) {
		r = randomInteger(0, i);
		temp = arr[i];
		arr[i] = arr[r];
		arr[r] = temp;
	}
	return arr;
}
//Проверка на наложение комнат друг на друга
function isCollide(a, b) {
	return !(
		((a.y + a.h) < (b.y)) ||
		(a.y > (b.y + b.h)) ||
		((a.x + a.w) < b.x) ||
		(a.x > (b.x + b.w))
	);
}