const mongoose = require('mongoose');
const { articleURLValidator } = require('../validators');

const articlesSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		min: 4,
	},
	section: {
		type: String,
		required: true,
		trim: true,
		min: 4,
	},
	url: {
		type: String,
		required: true,
		trim: true,
		validate: [articleURLValidator, 'Invalid URL'],
	},
});

const Article = mongoose.model('Article', articlesSchema);
module.exports = { Article };
