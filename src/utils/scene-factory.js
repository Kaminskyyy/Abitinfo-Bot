const { Scenes } = require('telegraf');

async function done(ctx, nextScene, isOk) {
	const nextScenes = await Promise.resolve(nextScene());
	if (nextScenes) {
		if (isOk) return ctx.scene.enter(nextScenes[0]);
		return ctx.scene.enter(nextScenes[1]);
	}
	return ctx.scene.leave();
}

function composeWizardScene(...stepFuncs) {
	//
	return (sceneName, nextScene) => {
		//
		return new Scenes.WizardScene(
			sceneName,
			...stepFuncs.map((handler) => {
				if (typeof handler !== 'function') {
					handler.done = (ctx, isOk) => done(ctx, nextScene, isOk);
					return handler;
				} else {
					return async (ctx, next) => {
						//if (!ctx.message && !ctx.callbackQuery) return undefined;
						return handler(ctx, (isOk) => done(ctx, nextScene, isOk), next);
					};
				}
			})
		);
	};
}

module.exports = { composeWizardScene };
