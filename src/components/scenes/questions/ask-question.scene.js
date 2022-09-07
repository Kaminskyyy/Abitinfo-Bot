const { Scenes, Markup } = require('telegraf');
const {
	checkoutAnswerOrQuestionKeyboard,
	mainMenuKeyboard,
} = require('../../../lib/keyboards/static-keyboards');
const questionManager = require('../../../lib/questions/questions');
const { ASK_QUESTION_SCENE, SEND, LEAVE, CANCEL } = require('../../../store/strings');

const askQuestionScene = new Scenes.BaseScene(ASK_QUESTION_SCENE);

const sessions = new Map();

askQuestionScene.enter((ctx) => {
	ctx.reply(
		'Тут ты можешь задать анонимный вопрос и позже я пришлю тебе ответ!)\nЗадай вопрос одним сообщением!',
		Markup.removeKeyboard()
	);

	sessions.set(ctx.message.from.id, {});
});

askQuestionScene.on('text', async (ctx) => {
	const session = sessions.get(ctx.message.from.id);

	session.question = {
		text: ctx.message.text,
		entitites: ctx.message.entities,
	};

	await ctx.reply('Отправить?', checkoutAnswerOrQuestionKeyboard);
});

askQuestionScene.on('callback_query', async (ctx) => {
	const chatId = ctx.update.callback_query.from.id;
	const cbData = ctx.update.callback_query.data;
	const session = sessions.get(chatId);

	if (cbData === SEND) {
		try {
			await questionManager.ask(chatId, session.question);
			ctx.answerCbQuery('Отправлено');
		} catch (error) {
			console.log(error);
			ctx.answerCbQuery('Что-то пошло не так');
		}
		return ctx.scene.leave();
	}

	if (cbData === LEAVE) {
		ctx.answerCbQuery();
		return ctx.scene.leave();
	}

	if (cbData === CANCEL) {
		ctx.answerCbQuery();
		ctx.reply('Задай новый вопрос!');
	}
});

askQuestionScene.leave((ctx) => {
	sessions.delete(ctx.update.callback_query.from.id);
	ctx.reply('📃', mainMenuKeyboard);
});

module.exports = { askQuestionScene };
