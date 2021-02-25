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
  getInstance
};
