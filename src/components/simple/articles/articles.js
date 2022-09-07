const { Composer } = require('telegraf');
const { createPage } = require('./articles-page');
const { navigationMarks } = require('../../../store/strings');
const { mainMenu } = require('../../../store/strings');

const articles = new Composer();

articles.hears(mainMenu.ARTICLES, async (ctx) => {
	const keyboard = await createPage(1);
	ctx.reply('📃    Статьи    📃', keyboard);
});

const articlesNavRegExp = new RegExp(`${navigationMarks.ARTICLES}${navigationMarks.ENDING}`);
articles.action(articlesNavRegExp, async (ctx) => {
	console.log(ctx.update.callback_query.data);

	const page = parseInt(
		ctx.update.callback_query.data.replace(`${navigationMarks.ARTICLES}${navigationMarks.ENDING}`, '')
	);
	const messageId = ctx.update.callback_query.message.message_id;
	const chatId = ctx.update.callback_query.from.id;

	const keyboard = await createPage(page);

	await ctx.telegram.editMessageReplyMarkup(chatId, messageId, undefined, keyboard.reply_markup);
});

module.exports = articles;
