const { Composer } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard');
const { Article } = require('../db/models/article');
const { createArticlesKeyboard } = require('../utils/keyboards');
const { SPECIALTIES, ABOUT_IASA, MISCELLANEOUS, MAIN_MENU, ARTICLES } = require('../store/triggerStrings');

const bot = new Composer();

const chooseSectionKeyboard = Keyboard.make([SPECIALTIES, ABOUT_IASA, MISCELLANEOUS, MAIN_MENU], {
	columns: 1,
}).reply();

bot.hears(ARTICLES, async (ctx) => {
	return await ctx.reply('Выбери о чем ты хочешь почитать', chooseSectionKeyboard);
});

bot.hears(SPECIALTIES, async (ctx) => {
	try {
		let articles = await Article.find({ section: SPECIALTIES });
		articles = articles.map((article) => {
			return {
				name: article.name,
				url: article.url,
			};
		});

		console.log(articles);

		// const keyboard = createArticlesKeyboard(articles);

		return await ctx.reply('Specs articles', keyboard);
	} catch (error) {
		return await ctx.reply('Something went wrong!\nTry later.');
	}
});

bot.hears(ABOUT_IASA, async (ctx) => {
	try {
		let articles = await Article.find({ section: ABOUT_IASA });
		articles = articles.map((article) => {
			return {
				name: article.name,
				url: article.url,
			};
		});

		const keyboard = createArticlesKeyboard(articles);

		return await ctx.reply('About IASA articles', keyboard);
	} catch (error) {
		return await ctx.reply('Something went wrong!\nTry later.');
	}
});

bot.hears(MISCELLANEOUS, async (ctx) => {
	try {
		let articles = await Article.find({ section: MISCELLANEOUS });
		articles = articles.map((article) => {
			return {
				name: article.name,
				url: article.url,
			};
		});

		const keyboard = createArticlesKeyboard(articles);

		return await ctx.reply('Misc articles', keyboard);
	} catch (error) {
		return await ctx.reply('Something went wrong!\nTry later.');
	}
});

module.exports = bot;
