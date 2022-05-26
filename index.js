const getClient = async function (context) {
	const pg = require("pg");
	const proxyId = "akf1ca19r8vbi37sutha";
	const proxyEndpoint = "akf1ca19r8vbi37sutha.postgresql-proxy.serverless.yandexcloud.net";
	const user = "user1";
	const connection = `postgres://${user}:${context.token.access_token}@${proxyEndpoint}:6432/${proxyId}?ssl=true`;
	return new pg.Client(connection);
};

module.exports.handler = async function (event, context) {
	const client = await getClient(context);
	client.connect();

	let result = await client.query("SELECT * FROM backend");

	return {
		statusCode: 200,
		body: result
	};
};

/*delete и put*/


/*
const connect = async function (client) {
	const express = require('express');
	const cors = require("cors");
	const app = express();
	app.use(cors());
	app.use(express.json());

	app.get('/lists', (req, res) => {
		res.send({ application: 'sample-app', version: '1.0' });
	});

	app.post('/lists', async (req, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
		const body = JSON.parse(Buffer.from(req.body, 'base64').toString())
		await client.query(`INSERT INTO data (id, name, boughtProducts, pendingProducts) VALUES(${body.id}, '${body.name}', ARRAY[]::INT[], ARRAY[]::INT[])`);
		res.send({ ...req.body });
	});

	return app;
}

const getClient = async function (context) {
	const pg = require("pg");
	const proxyId = "akf1ca19r8vbi37sutha";
	const proxyEndpoint = "akf1ca19r8vbi37sutha.postgresql-proxy.serverless.yandexcloud.net";
	const user = "user1";
	const connection = `postgres://${user}:${context.token.access_token}@${proxyEndpoint}:6432/${proxyId}?ssl=true`;
	return new pg.Client(connection);
};

module.exports.handler = async function (event, context) {
	const serverless = require('serverless-http');
	const client = await getClient(context);
	client.connect();
	const app = await connect(client);
	serverless(app);
};
*/
