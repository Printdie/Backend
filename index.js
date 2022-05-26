const express = require('express');
const { Client } = require("pg");
const serverless = require('serverless-http');

const createClient = (token) => {
	const proxyId = "akfeee9p1eubbfg533h4";
	const proxyEndpoint = "akfeee9p1eubbfg533h4.postgresql-proxy.serverless.yandexcloud.net:6432";
	const user = "user1";
	const conString = "postgres://" + user + ":" + token + "@" + proxyEndpoint + "/" + proxyId + "?ssl=true";
	const client = new Client(conString);
	client.connect();
	return client;
}

const app = express();

app.get('/lists', async (req, res) => {
	const client = createClient(req.apiGateway.context.token.access_token)
	let result = await client.query("SELECT * FROM data");
	res.send([...result.rows]);
});

app.post('/lists', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
	const body = JSON.parse(Buffer.from(req.body, 'base64').toString())
	const client = createClient(req.apiGateway.context.token.access_token)
	await client.query(`INSERT INTO data (id, name, boughtProducts, pendingProducts) VALUES(${body.id}, '${body.name}', ARRAY[]::INT[], ARRAY[]::INT[])`);
	res.send({ ...req.body });
});

app.post('/lists/delete', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
	const body = JSON.parse(Buffer.from(req.body, 'base64').toString())
	const client = createClient(req.apiGateway.context.token.access_token)
	await client.query(`DELETE FROM data WHERE id='${body.id}'`);
	res.send({ ...req.body });
});

app.post('/lists/put', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
	const body = JSON.parse(Buffer.from(req.body, 'base64').toString())
	const client = createClient(req.apiGateway.context.token.access_token)
	await client.query(`UPDATE data SET name = '${body.name}' WHERE id = ${body.id}`);
	res.send({ ...req.body });
});

module.exports.handler = serverless(app);
