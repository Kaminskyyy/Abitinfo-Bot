const http = require('../http/http');

//	Storage for the questions in processing to preclude race conditions
const questionsInProcessing = new Set();

async function create(authorChatId, question) {
	const newQuestion = {
		...question,
		author_chat_id: authorChatId,
	};
	const response = await http.post('/questions', newQuestion);

	return response.data.question;
}

async function get(questionId) {
	const response = await http.get(`/questions/${questionId}`);

	return response.data.question;
}

async function update(questionId, updates) {
	// return await Question.findOneAndUpdate({ question_id: questionId }, updates);

	const response = await http.patch(`/questions/${questionId}`, updates);

	return response.data.question;
}

async function remove(questionId) {
	const response = await http.delete(`/questions/${questionId}`);

	return response.data.question;
}

function isQuestionInProcessing(questionId) {
	return questionsInProcessing.has(questionId);
}

function setQuestionAsInProcessing(questionId) {
	return questionsInProcessing.add(questionId);
}

function removeQuestionFromInProcessing(questionId) {
	return questionsInProcessing.delete(questionId);
}

module.exports = {
	create,
	get,
	remove,
	update,
	isQuestionInProcessing,
	setQuestionAsInProcessing,
	removeQuestionFromInProcessing,
};
