const shortid = require('shortid');
const { telegram } = require('../../utils/telegram');
const QAChannelAPI = require('../api/qa-channel.api');
const questionsAPI = require('../api/questions.api');

async function ask(userChatId, question) {
	question.question_id = shortid.generate();
	const { message_id } = await QAChannelAPI.postQuestion(question);

	question.message_id = message_id;
	await questionsAPI.create(userChatId, question);
}

async function startAnswering(questionId) {
	try {
		const question = await questionsAPI.get(questionId);
		await QAChannelAPI.markQuestionAsAnswered(question);

		return question;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

async function finishAnswering(answer, question) {
	try {
		await telegram.sendMessage(question.author_chat_id, 'Пришел ответ на твой вопрос!)');
		await telegram.sendMessage(question.author_chat_id, answer.text, {
			entities: answer.entities,
		});

		await questionsAPI.remove(question.question_id);
		// questionsAPI.removeQuestionFromInProcessing(question.question_id);
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

async function cancelAnswering(question) {
	try {
		await QAChannelAPI.deletePost(question.message_id);
		const questionPost = await QAChannelAPI.postQuestion(question);
		await questionsAPI.update(question.question_id, {
			message_id: questionPost.message_id,
		});
		questionsAPI.removeQuestionFromInProcessing(question.question_id);
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

module.exports = { ask, startAnswering, finishAnswering, cancelAnswering };
