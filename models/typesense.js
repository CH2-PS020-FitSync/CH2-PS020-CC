const Typesense = require('typesense');

const host = process.env.TYPESENSE_HOST;
const port = process.env.TYPESENSE_PORT;
const protocol = process.env.TYPESENSE_PROTOCOL;
const apiKey = process.env.TYPESENSE_API_KEY;

const client = new Typesense.Client({
  nodes: [
    {
      host,
      port,
      protocol,
    },
  ],
  apiKey,
  connectionTimeoutSeconds: 2,
});

module.exports = client;
