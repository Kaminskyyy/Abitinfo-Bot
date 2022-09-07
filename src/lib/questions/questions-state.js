const questionsInProcessing = new Set();

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
	isQuestionInProcessing,
	setQuestionAsInProcessing,
	removeQuestionFromInProcessing,
};
