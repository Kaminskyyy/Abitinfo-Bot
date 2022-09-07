const { Telegraf, Scenes, session } = require('telegraf');
const { answerQuestionScene } = require('./components/scenes/questions/answer-question.scene');
const { askQuestionScene } = require('./components/scenes/questions/ask-question.scene');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([answerQuestionScene, askQuestionScene]);
bot.use(session());
bot.use(stage.middleware());

bot.catch((err, ctx) => {
	console.log(err);
	ctx.reply('Something went wrong(');
});

bot.use(require('./components/simple/superheroes/superheroes'));
bot.use(require('./components/simple/main/main'));
bot.use(require('./components/simple/articles/articles'));

module.exports = { bot };
