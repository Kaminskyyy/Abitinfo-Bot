const { articles } = require('../../config/config');
const http = require('../http/http');

async function getArticlesPage(page) {
	const response = await http.get(
		`/articles?page=${page}&itemsPerPage=${articles.itemsPerPage}&images=${articles.images}`
	);

	return response.data;
}

module.exports = {
	getArticlesPage,
};
