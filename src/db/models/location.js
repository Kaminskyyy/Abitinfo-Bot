const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		min: 4,
	},
	description: {
		type: String,
		trim: true,
		min: 4,
	},
	location: {
		latitude: {
			type: String,
			required: true,
			trim: true,
		},
		longitude: {
			type: String,
			required: true,
			trim: true,
		},
	},
});

const Location = mongoose.model('Location', locationSchema);

module.exports = { Location };
