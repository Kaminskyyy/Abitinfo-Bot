const validator = require('validator');

function articleURLValidator(value) {
	return validator.isURL(value);
}

module.exports = { articleURLValidator };
