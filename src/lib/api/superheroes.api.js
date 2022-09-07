const { superheroes } = require('../../config/config');
const http = require('../http/http');

async function getSupeheroesPage(page, speciality) {
	let url = `/students/superheroes?page=${page}&itemsPerPage=${superheroes.itemsPerPage}&images=${superheroes.images}`;
	if (speciality) url += `&speciality=${speciality}`;

	const response = await http.get(url);

	return response.data;
}

module.exports = { getSupeheroesPage };
