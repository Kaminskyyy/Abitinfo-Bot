const articlesAPI = require('../../../lib/api/articles.api');
const { createInlineKeyboardWithLinks } = require('../../../lib/keyboards/dynamic-keyboards');
const { navigationMarks } = require('../../../store/strings');

async function createPage(page) {
	const { articles, navigation } = await articlesAPI.getArticlesPage(page);

	const articlesKeyboardItems = articles.map((article) => {
		return {
			text: article.title,
			url: article.url,
		};
	});

	navigation.mark = navigationMarks.ARTICLES;

	const keyboard = createInlineKeyboardWithLinks(articlesKeyboardItems, { columns: 1 }, navigation);

	return keyboard;
}

module.exports = { createPage };
