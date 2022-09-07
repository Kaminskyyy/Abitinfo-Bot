const { Composer } = require('telegraf');
const { mainMenu, ASK_QUESTION_SCENE, ANSWER_QUESTION_SCENE } = require('../../../store/strings');
const { mainMenuKeyboard } = require('../../../lib/keyboards/static-keyboards');
const questionStateManager = require('../../../lib/questions/questions-state');
const main = new Composer();

main.start(async (ctx) => {
	if (ctx.startPayload) {
		const quesitonId = ctx.startPayload;

		if (!questionStateManager.isQuestionInProcessing(quesitonId)) {
			questionStateManager.setQuestionAsInProcessing(quesitonId);
			return ctx.scene.enter(ANSWER_QUESTION_SCENE);
		}
		ctx.reply('На данный вопрос уже отвечают');
	}

	// const user = {
	// 	chatId: String(ctx.message.chat.id),
	// 	username: ctx.message.chat.username,
	// 	notifications: true,
	// };

	// await saveUser(ctx.message.chat.id, ctx.message.chat.username);

	await ctx.reply('Приветикс! Я абит бот.\nЧем тебе помочь?', mainMenuKeyboard);
	// ctx.scene.enter(MAIN_MENU_SCENE);
});

main.hears(mainMenu.ASK_QUESTION, (ctx) => {
	ctx.scene.enter(ASK_QUESTION_SCENE);
});

// main.hears()

module.exports = main;
