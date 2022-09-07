const { User } = require('../../../../db/models/user');

async function saveUser(chatId, username) {
	try {
		const user = await User.findOne({ chat_id: chatId }).select(['username']);

		console.log(user);

		if (user) return true;

		const newUser = new User({
			chat_id: chatId,
			username: username,
			notifications: true,
		});

		await newUser.save(ctx.message.chat.id, ctx.message.chat.username);

		return false;
	} catch (error) {
		console.log(error);
	}
}

module.exprts = { saveUser };
