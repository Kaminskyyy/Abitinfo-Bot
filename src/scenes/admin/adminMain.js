const { Scenes, session } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard');
const { ADD_ARTICLE_SCENE, ADMIN_SCENE, MAIN_MENU, ADD_ARTICLE } = require('../../store/triggerStrings');

const adminScene = new Scenes.BaseScene(ADMIN_SCENE);

const keyboard = Keyboard.make([ADD_ARTICLE, MAIN_MENU], {
	columns: 1,
}).reply();

adminScene.enter((ctx) => {
	ctx.reply('ADMIN MENU', keyboard);
});

adminScene.hears(ADD_ARTICLE, async (ctx) => {
	ctx.scene.enter(ADD_ARTICLE_SCENE);
});

adminScene.hears(MAIN_MENU, (ctx, next) => {
	ctx.scene.leave();
	next();
});

adminScene.leave((ctx) => {
	console.log('leave admin menu');
});

module.exports = adminScene;
