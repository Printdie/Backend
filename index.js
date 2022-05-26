const express = require('express');
const { Client } = require("pg");
const serverless = require('serverless-http');
const app = express();
const tableName = "backend";

const createClient = (request) => {
	const proxyId = "akf1ca19r8vbi37sutha";
	const proxyEndpoint = "akf1ca19r8vbi37sutha.postgresql-proxy.serverless.yandexcloud.net";
	const user = "user1";
	const connection = `postgres://${user}:${request.apiGateway.context.token.access_token}@${proxyEndpoint}:6432/${proxyId}?ssl=true`;
	const client = new Client(connection);
	client.connect();
	return client;
}

app.get('/lists', async (request, response) => {
	const client = createClient(request)
	let result = await client.query(`SELECT * FROM ${tableName}`);
	response.send([...result.rows]);
});

app.post('/lists', async (request, response) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
	const client = createClient(request);
	const body = JSON.parse(Buffer.from(request.body, 'base64').toString());

	await client.query(`INSERT INTO ${tableName} (id, name, boughtProducts, pendingProducts) VALUES(${body.id}, '${body.name}', ARRAY[]::INT[], ARRAY[]::INT[])`);
	response.send({ ...request.body });
});

app.delete('/lists', async (request, response) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
	const client = createClient(request);
	const body = JSON.parse(Buffer.from(request.body, 'base64').toString());

	await client.query(`DELETE FROM ${tableName} WHERE id='${body.id}'`);
	response.send({ ...request.body });
});

app.put('/lists', async (request, response) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
	const client = createClient(request);
	const body = JSON.parse(Buffer.from(request.body, 'base64').toString());

	await client.query(`UPDATE ${tableName} SET name = '${body.name}' WHERE id = ${body.id}`);
	response.send({ ...request.body });
});

module.exports.handler = serverless(app);
