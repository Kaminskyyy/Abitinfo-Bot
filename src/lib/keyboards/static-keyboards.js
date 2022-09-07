const { Keyboard, Key } = require('telegram-keyboard');
const { mainMenu, navigationMarks, YES, NEW_QUESTION, CANCEL, LEAVE, SEND } = require('../../store/strings');

const superheroesChooseSpecialityKeyboard = Keyboard.make(
	[
		Key.callback(122, `${navigationMarks.SUPERHEROES}${navigationMarks.ENDING}1-122`),
		Key.callback(124, `${navigationMarks.SUPERHEROES}${navigationMarks.ENDING}1-124`),
	],
	{ columns: 1 }
).inline();

const mainMenuKeyboard = Keyboard.make(
	[mainMenu.ARTICLES, mainMenu.LOCATIONS, mainMenu.SUPERHEROES, mainMenu.ASK_QUESTION],
	{
		columns: 2,
	}
).reply();

const checkoutQuestionKeyboard = Keyboard.make([YES, NEW_QUESTION, CANCEL], {
	columns: 1,
}).reply();

const cancelAnsweringQuestionKeyboard = Keyboard.make([Key.callback(LEAVE, LEAVE)]).inline();

const checkoutAnswerOrQuestionKeyboard = Keyboard.make(
	[Key.callback(SEND, SEND), Key.callback(CANCEL, CANCEL), Key.callback(LEAVE, LEAVE)],
	{
		columns: 1,
	}
).inline();

module.exports = {
	mainMenuKeyboard,
	checkoutQuestionKeyboard,
	cancelAnsweringQuestionKeyboard,
	checkoutAnswerOrQuestionKeyboard,
	superheroesChooseSpecialityKeyboard,
};
