const { Composer, Scenes } = require('telegraf');
const { Location } = require('../../../db/models/location');
const {
	NAV_NEXT_PAGE_SIGN,
	NAV_PREV_PAGE_SIGN,
	LOCATIONS_SCENE,
	MAIN_MENU,
	MAIN_MENU_SCENE,
} = require('../../store/strings');
const { createLocationsKeyboard } = require('../../lib/keyboards/dynamic-keyboards');

const locationsScene = new Scenes.BaseScene(LOCATIONS_SCENE);

locationsScene.enter(async (ctx) => {
	try {
		let locations = await Location.find({});
		location = locations.map((location) => location.name);

		let keyboard = null;

		if (locations.length > 5) {
			keyboard = createLocationsKeyboard(locations.slice(0, 5), null, 2);
		} else {
			keyboard = createLocationsKeyboard(locations.slice(0, 5), null, null);
		}

		return await ctx.reply('places\nPage 1', keyboard);
	} catch (error) {
		console.log(error);
		return await ctx.reply('Something went wrong');
	}
});

locationsScene.hears(new RegExp(`${NAV_PREV_PAGE_SIGN}|${NAV_NEXT_PAGE_SIGN}`), async (ctx) => {
	try {
		let page = null;
		if (ctx.message.text.includes(NAV_PREV_PAGE_SIGN)) {
			page = +ctx.message.text.replace(`${NAV_PREV_PAGE_SIGN}`, '').trim();
		} else if (ctx.message.text.includes(NAV_NEXT_PAGE_SIGN)) {
			page = +ctx.message.text.replace(`${NAV_NEXT_PAGE_SIGN}`, '').trim();
		}

		let locations = await Location.aggregate([
			{
				$skip: 5 * (page - 1),
			},
			{
				$limit: 5,
			},
		]);
		location = locations.map((location) => location.name);
		const locationsCount = await Location.count();

		const prevPage = page > 1 ? page - 1 : null;
		const nextPage = locationsCount - 5 * page > 0 ? page + 1 : null;

		const keyboard = createLocationsKeyboard(locations, prevPage, nextPage);
		return await ctx.reply(`Places\nPage ${page}`, keyboard);
	} catch (error) {
		console.log(error);
		return await ctx.reply('Something went wrong');
	}
});

locationsScene.hears(/🌎 /, async (ctx) => {
	try {
		const name = ctx.message.text.replace('🌎 ', '');

		const place = await Location.findOne({ name: name });
		const { latitude, longitude } = place.location;

		return ctx.replyWithLocation(latitude, longitude);
	} catch (error) {
		console.log(error);
		return ctx.reply('Something went wrong!');
	}
});

locationsScene.hears(MAIN_MENU, (ctx) => {
	ctx.scene.enter(MAIN_MENU_SCENE);
});

locationsScene.on('message', (ctx, next) => {
	if (ctx.update.message.text.includes('/start')) next();
});

module.exports = { locationsScene };
