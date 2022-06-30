const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL).catch(console.log);

mongoose.connection.on('connected', () => {
	console.log('DB connected');
});
