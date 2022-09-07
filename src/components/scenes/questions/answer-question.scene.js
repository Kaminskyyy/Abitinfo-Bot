const { Scenes } = require('telegraf');
const {
	cancelAnsweringQuestionKeyboard,
	checkoutAnswerOrQuestionKeyboard,
	mainMenuKeyboard,
} = require('../../../lib/keyboards/static-keyboards');
const questionManager = require('../../../lib/questions/questions');
const questionStateManager = require('../../../lib/questions/questions-state');
const { ANSWER_QUESTION_SCENE, LEAVE, CANCEL, SEND, MAIN_MENU_SCENE } = require('../../../store/strings');

const sessions = new Map();

const answerQuestionScene = new Scenes.BaseScene(ANSWER_QUESTION_SCENE);

answerQuestionScene.enter(async (ctx) => {
	try {
		const question = await questionManager.startAnswering(ctx.startPayload);
		await ctx.reply(question.text, {
			entities: question.entities,
		});

		sessions.set(ctx.message.from.id, {
			question,
		});

		await ctx.reply('Write answer');
	} catch (error) {
		console.log(error);
		ctx.reply(error.message, cancelAnsweringQuestionKeyboard);
	}
});

answerQuestionScene.on('text', async (ctx) => {
	const session = sessions.get(ctx.update.message.from.id);

	session.answer = {
		text: ctx.update.message.text,
		entities: ctx.update.message.entities,
	};

	await ctx.reply('Send?', checkoutAnswerOrQuestionKeyboard);
});

answerQuestionScene.on('callback_query', async (ctx) => {
	const chatId = ctx.update.callback_query.from.id;
	const cbData = ctx.update.callback_query.data;
	const session = sessions.get(ctx.update.callback_query.from.id);

	if (cbData === SEND) {
		try {
			await questionManager.finishAnswering(session.answer, session.question);
			ctx.answerCbQuery('Отправлено');
		} catch (error) {
			console.log(error);
			ctx.answerCbQuery('Что-то пошло не так');
		}

		return ctx.scene.leave();
	}

	if (cbData === LEAVE) {
		questionManager.cancelAnswering(session.question);
		ctx.answerCbQuery();
		return ctx.scene.leave();
	}

	if (cbData === CANCEL) {
		ctx.reply('Write new answer');
	}
});

answerQuestionScene.leave((ctx) => {
	const questionId = sessions.get(ctx.update.callback_query.from.id).question.question_id;
	questionStateManager.removeQuestionFromInProcessing(questionId);
	sessions.delete(ctx.update.callback_query.from.id);
	ctx.reply('📃', mainMenuKeyboard);
});

module.exports = { answerQuestionScene };
