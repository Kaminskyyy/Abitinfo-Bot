const { Keyboard, Key } = require('telegram-keyboard');
const { MAIN_MENU, NAV_NEXT_PAGE_SIGN, NAV_PREV_PAGE_SIGN } = require('../store/triggerStrings');

function createArticlesKeyboard(elements) {
	const keys = elements.map((element) => {
		return [Key.url(element.name, element.url)];
	});

	return Keyboard.make(keys).inline();
}

function createLocationsKeyboard(elements, prevPage, nextPage) {
	const keys = elements.map((element) => {
		return [`🌎 ${element.name}`];
	});

	if (prevPage && nextPage) {
		keys.push([`${prevPage} ${NAV_PREV_PAGE_SIGN}`, MAIN_MENU, `${NAV_NEXT_PAGE_SIGN} ${nextPage}`]);
	} else if (nextPage) {
		keys.push([MAIN_MENU, `${NAV_NEXT_PAGE_SIGN} ${nextPage}`]);
	} else if (prevPage) {
		keys.push([`${prevPage} ${NAV_PREV_PAGE_SIGN}`, MAIN_MENU]);
	} else {
		keys.push([MAIN_MENU]);
	}

	return Keyboard.make(keys).reply();
}

module.exports = { createArticlesKeyboard, createLocationsKeyboard };
