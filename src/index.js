require('dotenv/config.js');
require('./db/db');
const { Telegraf, Scenes, session } = require('telegraf');
const { createAddArticleScene } = require('./scenes/admin/addArticle');
const { ADD_ARTICLE_SCENE, ADMIN_SCENE } = require('./store/triggerStrings');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([
	require('./scenes/admin/adminMain'),
	createAddArticleScene(ADD_ARTICLE_SCENE, () => [ADMIN_SCENE, ADD_ARTICLE_SCENE]),
]);
bot.use(session());
bot.use(stage.middleware());

bot.use(require('./components/locations'));
bot.use(require('./components/main'));
bot.use(require('./components/articles'));

bot.launch();
