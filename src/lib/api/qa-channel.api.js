const { Markup } = require('telegraf');
const { createQuestionPostKeyboard } = require('../keyboards/dynamic-keyboards');
const { telegram } = require('../../utils/telegram');

async function postQuestion({ text, entities, question_id } = {}) {
	return await telegram.sendMessage(process.env.CHANNEL_ID, text, {
		entities: entities,
		reply_markup: createQuestionPostKeyboard(question_id),
	});
}

async function markQuestionAsAnswered({ text, entities, message_id } = {}) {
	const markedText = `Выполнено\n\n${text}`;

	const extra = {
		entities,
		reply_markup: Markup.inlineKeyboard([]).reply_markup,
	};

	await telegram.editMessageText(process.env.CHANNEL_ID, message_id, undefined, markedText, extra);
}

async function deletePost(messageId) {
	await telegram.deleteMessage(process.env.CHANNEL_ID, messageId);
}

module.exports = { postQuestion, markQuestionAsAnswered, deletePost };
