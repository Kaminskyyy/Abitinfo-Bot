const { Keyboard, Key } = require('telegram-keyboard');
const {
	NAV_NEXT_PAGE_SIGN,
	NAV_PREV_PAGE_SIGN,
	SEND,
	CANCEL,
	LEAVE,
	navigationMarks,
} = require('../../store/strings');

function createInlineNavigationKeboard(navigation, independent = false, backButton = null) {
	const keyboardItems = [];

	const mark = navigation.mark + navigationMarks.ENDING;

	if (navigation.left) keyboardItems.push(Key.callback('<--', mark + navigation.left));
	if (navigation.right) keyboardItems.push(Key.callback('-->', mark + navigation.right));
	if (backButton) keyboardItems.push(Key.callback(backButton.text, backButton.callbackData));

	const keyboard = Keyboard.make(keyboardItems, {
		pattern: [2, 1],
	});

	if (independent) return keyboard.inline();
	return keyboard;
}

function createInlineKeyboardWithLinks(items, options = {}, navigation = false) {
	const mainKeyboardItems = items.map((item) => {
		return Key.url(item.text, item.url);
	});

	const mainKeyboard = Keyboard.make(mainKeyboardItems, options);

	if (!navigation) return mainKeyboard.inline();

	const navigationKeyboard = createInlineNavigationKeboard(navigation);

	return Keyboard.make(() => {
		return Keyboard.combine(mainKeyboard, navigationKeyboard);
	})
		.construct()
		.inline();
}

// function createLocationsKeyboard(elements, prevPage, nextPage) {
// 	const keys = elements.map((element) => {
// 		return [`🌎 ${element.name}`];
// 	});

// 	if (prevPage && nextPage) {
// 		keys.push([`${prevPage} ${NAV_PREV_PAGE_SIGN}`, MAIN_MENU, `${NAV_NEXT_PAGE_SIGN} ${nextPage}`]);
// 	} else if (nextPage) {
// 		keys.push([MAIN_MENU, `${NAV_NEXT_PAGE_SIGN} ${nextPage}`]);
// 	} else if (prevPage) {
// 		keys.push([`${prevPage} ${NAV_PREV_PAGE_SIGN}`, MAIN_MENU]);
// 	} else {
// 		keys.push([MAIN_MENU]);
// 	}

// 	return Keyboard.make(keys).reply();
// }

function createQuestionPostKeyboard(questionId) {
	const questionIdEncoded = encodeURIComponent(questionId);
	const url = `https://t.me/${process.env.BOT_USERNAME}?start=${questionIdEncoded}`;

	return Keyboard.make([Key.url('Ответить', url)]).inline().reply_markup;
}

module.exports = {
	createInlineNavigationKeboard,
	createQuestionPostKeyboard,
	createInlineKeyboardWithLinks,
};
