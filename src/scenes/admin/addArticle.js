const { Scenes, Composer } = require('telegraf');
const { Keyboard } = require('telegram-keyboard');
const { composeWizardScene } = require('../../utils/sceneFactory');
const { Article } = require('../../db/models/article');
const { SPECIALTIES, ABOUT_IASA, MISCELLANEOUS } = require('../../store/triggerStrings');

const sessions = new Map();

const sections = [SPECIALTIES, ABOUT_IASA, MISCELLANEOUS];
const chooseSectionKeyboard = Keyboard.make(sections, {
	columns: 1,
}).reply();

const checkCorrectnessKeyboard = Keyboard.make(['Да', 'Начать с начала =)', 'Отменить и выйти']).reply();

const createAddArticleScene = composeWizardScene(
	async (ctx) => {
		ctx.reply('Укажи раздел для новой статьи', chooseSectionKeyboard);

		sessions.set(ctx.message.username, {});

		ctx.wizard.next();
	},
	async (ctx) => {
		try {
			if (!sections.includes(ctx.message.text)) throw new Error('Invalid section name');

			const session = sessions.get(ctx.message.username);
			if (!session) throw new Error('Session absence error');

			session.section = ctx.message.text;

			await ctx.reply('Укажи название статьи', chooseSectionKeyboard);
			return ctx.wizard.next();
		} catch (error) {
			return ctx.reply(error.message);
		}
	},
	async (ctx) => {
		try {
			const session = sessions.get(ctx.message.username);
			if (!session) throw new Error('Session absence error');

			session.name = ctx.message.text;

			ctx.reply('Укажи ссылку на статью');
			return ctx.wizard.next();
		} catch (error) {
			return ctx.reply(error.message);
		}
	},
	async (ctx) => {
		try {
			const session = sessions.get(ctx.message.username);
			if (!session) throw new Error('Session absence error');

			session.url = ctx.message.text;

			ctx.reply(`Раздел: ${session.section}\nНазвание: ${session.name}\nСсылка: ${session.url}\n`);
			ctx.reply('Все верно?', checkCorrectnessKeyboard);
			return ctx.wizard.next();
		} catch (error) {
			return ctx.reply(error.message);
		}
	},
	async (ctx, done) => {
		if (ctx.message.text === 'Начать с начала =)') {
			return done(false);
		}
		if (ctx.message.text === 'Отменить и выйти') {
			sessions.delete(ctx.message.username);
			return done(true);
		}

		try {
			const session = sessions.get(ctx.message.username);
			if (!session) throw new Error('Session absence error');

			const newArticle = new Article({
				name: session.name,
				section: session.section,
				url: session.url,
			});

			await newArticle.save();
			ctx.reply('Статья сохранена');

			sessions.delete(ctx.message.username);

			return done(true);
		} catch (error) {
			ctx.reply('Something went wrong');
			return done(false);
		}
	}
);

module.exports = { createAddArticleScene };
