/*
const pg = require("pg");

const getClient = async function () {
	const proxyId = "akf1ca19r8vbi37sutha";
	const proxyEndpoint = "akf1ca19r8vbi37sutha.postgresql-proxy.serverless.yandexcloud.net";
	const user = "user1";
	const accessToken = "t1.9euelZrPicydm5vJxpHGi8mZkoyTlO3rnpWaz4-LzZacl5mSyI-PxpPNlJfl9PdIC0dr-e8tKVX43fT3CDpEa_nvLSlV-A.Ujw9bnyLdWTqu6fzBia__qUa7de1q60K7jgvJfWdT3V_N9hRK2gG1TXSPZa9uUysLdPfpSU5ynY7koUKzUpjCA";

	const connection = `postgres://${user}:${accessToken}@${proxyEndpoint}:6432/${proxyId}?ssl=true`;
	return new pg.Client(connection);
};

module.exports.handler = async function (event, context) {
	const client = await getClient();
	client.connect();

	let result = await client.query("SELECT * FROM backend");

	return {
		statusCode: 200,
		body: context.token.access_token
	};
};
*/


const express = require('express');
const { Client } = require("pg");
const cors = require("cors");
const serverless = require('serverless-http');
let serverless = require('serverless-http');

const proxyId = "akfeee9p1eubbfg533h4"; // Идентификатор подключения
const proxyEndpoint = "akfeee9p1eubbfg533h4.postgresql-proxy.serverless.yandexcloud.net:6432"; // Точка входа
const user = "user1"; // Пользователь БД
const conString = "postgres://" + user + ":t1.9euelZqLl5POnseRkpyOjsyejMfPju3rnpWai5KXi4yLjs3HnoqTj57Jmpzl8_c-Vkdr-e8vThJC_t3z934ERWv57y9OEkL-.C4aXYX8t_-vd-O5RQUi_x_luarm8f-zGUPhfT43KdYUncgFYNUUHwf8169Nr2goz7ZkQOPI7eWG460FZ5KPCDg@" + proxyEndpoint + "/" + proxyId + "?ssl=true";
const client = new Client(conString);
client.connect();

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
/*delete и put*/


const getClient = async function (context) {
	const proxyId = "akf1ca19r8vbi37sutha";
	const proxyEndpoint = "akf1ca19r8vbi37sutha.postgresql-proxy.serverless.yandexcloud.net";
	const user = "user1";
	const connection = `postgres://${user}:${context.token.access_token}@${proxyEndpoint}:6432/${proxyId}?ssl=true`;
	return new pg.Client(connection);
};

module.exports.handler = async function (event, context) {
	const client = await getClient(context);
	client.connect();
	return serverless(app);
};
