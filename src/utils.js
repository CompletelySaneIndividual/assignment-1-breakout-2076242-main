export function getRandomNumber(min, max) {
	return (Math.random() * (max - min) + min) * (Math.random() < 0.5 ? -1 : 1);
}

export function getRandomPositiveNumber(min, max) {
	return (Math.random() * (max - min) + min);
}

export function getRandomNegativeNumber(min, max) {
	return (Math.random() * (max - min) + min) * -1;
}
