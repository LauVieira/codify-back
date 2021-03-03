const uuid = require('uuid');
const redis = require('promise-redis')();

let client;

async function createInstance () {
  const client = redis.createClient({
    url: process.env.REDISCLOUD_URL
  });

  client.on('error', (error) => {
    console.error(error);
  });

  return client;
}

async function getInstance () {
  if (!client) {
    client = await createInstance();
  }

  return client;
}

async function setSession (key, payload) {
  const client = await getInstance();
  
  await client.set(key, payload);
}

async function setItem (payload) {
  const key = uuid.v4();
  const client = await getInstance();

  await client.set(key, JSON.stringify(payload));
  await client.expire(key, 900);

  return key;
}

async function getItem (key) {
  const client = await getInstance();

  const result = await client.get(key);

  return result ? JSON.parse(result) : false;
}

async function getSession (key) {
  const client = await getInstance();

  const result = await client.get(key);

  return result ? result: false;
}

async function deleteSession (key) {
  const client = await getInstance();

  await client.del(key);
}

function endConnection () {
  client.quit();
}

module.exports = { 
  getSession, 
  setSession, 
  deleteSession, 
  endConnection,
  setItem,
  getItem
};
