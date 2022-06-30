const { Composer } = require('telegraf');
const { Keyboard } = require('telegram-keyboard');
const { MAIN_MENU, ARTICLES, NAV_PLACES } = require('../store/triggerStrings');

const bot = new Composer();

const startMenuKeyboard = Keyboard.make([[ARTICLES], [NAV_PLACES, 'Что-то еще']]).reply();

bot.start((ctx) => {
	ctx.state.data = 'abc123';
	return ctx.reply('Приветикс! Я абит бот.\nЧем тебе помочь?', startMenuKeyboard);
});

bot.hears(MAIN_MENU, (ctx) => {
	return ctx.reply('📃', startMenuKeyboard);
});

bot.hears('➡️', (ctx) => {
	console.log('main next');
});

bot.on('location', (ctx) => {
	console.log(ctx.message);
});

bot.hears(/admin\//, (ctx) => {
	try {
		const password = ctx.message.text.split('/')[1];

		if (password === process.env.ADMIN_PASSWORD) {
			ctx.scene.enter('ADMIN_SCENE');
		} else throw new Error('Жулик ебаный)');
	} catch (error) {
		ctx.reply(error.message);
	}
});

module.exports = bot;
