const axios = require('axios').default;

const http = axios.create({
	baseURL: process.env.API_URL,
	timeout: 20000,
});

module.exports = http;
