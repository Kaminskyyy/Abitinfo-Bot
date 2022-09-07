const { Composer } = require('telegraf');
const { mainMenu, navigationMarks } = require('../../../store/strings');
const { createSuperheroesPage } = require('./superheroes-page');
const { superheroesChooseSpecialityKeyboard } = require('../../../lib/keyboards/static-keyboards');
const superheroes = new Composer();

//	Entry message. There will be more info about superheroes.
const entryMessageText = 'Инфа про супергероев...\n\nВыбери специальность';

//	Entry message. From main menu
superheroes.hears(mainMenu.SUPERHEROES, (ctx) => {
	ctx.reply(entryMessageText, superheroesChooseSpecialityKeyboard);
});

//	Return from list of superheroes with back button
superheroes.action(`${navigationMarks.SUPERHEROES}_ENTRY`, (ctx) => {
	const messageId = ctx.update.callback_query.message.message_id;
	const chatId = ctx.update.callback_query.from.id;

	ctx.telegram.editMessageText(chatId, messageId, undefined, entryMessageText, {
		reply_markup: superheroesChooseSpecialityKeyboard.reply_markup,
	});
});

//	RegExp for page navigation callbacks
const superheroesNavRegExp = new RegExp(`${navigationMarks.SUPERHEROES}${navigationMarks.ENDING}`);

//	Page navigation callbacks handler
superheroes.action(superheroesNavRegExp, async (ctx) => {
	const navigationData = ctx.update.callback_query.data.replace(
		`${navigationMarks.SUPERHEROES}${navigationMarks.ENDING}`,
		''
	);
	let [page, speciality] = navigationData.split('-');

	page = +page;
	speciality = +speciality;

	const messageId = ctx.update.callback_query.message.message_id;
	const chatId = ctx.update.callback_query.from.id;

	const [message, keyboard] = await createSuperheroesPage(page, speciality);

	await ctx.telegram.editMessageText(chatId, messageId, undefined, message, {
		reply_markup: keyboard.reply_markup,
	});
});

module.exports = superheroes;
