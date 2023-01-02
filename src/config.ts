import * as dotenv from 'dotenv';
import { cleanEnv, num, str, bool } from 'envalid';
import { env } from 'process';

dotenv.config();

export default cleanEnv(process.env, {
  MORALIS_API_KEY: str({
    desc: 'Your moralis Api key (keep this secret)',
    default: env.MORALIS_API_KEY,
  }),

  PORT: num({
    desc: 'Default port wher parse-server will run on',
    default: 1337,
  }),
  DATABASE_URI: str({
    desc: 'URI to your MongoDB database',
    devDefault: env.DATABASE_URI,
  }),
  CLOUD_PATH: str({
    desc: 'Path to your cloud code',
    default: './build/cloud/main.js',
  }),
  STREAM_PATH: str({
    desc: 'Path to your stream code',
    default: "./cloud/streams.json",
  }),

  MASTER_KEY: str({
    desc: 'A secret key of your choice (keep this secret)',
  }),
  APPLICATION_ID: str({
    desc: 'An id for your app, can be anything you want',
    default: env.APPLICATION_ID,
  }),
  SERVER_URL: str({
    desc: 'Referenece to your server URL. Replace this when your app is hosted',
    devDefault: env.SERVER_URL,
  }),

  REDIS_CONNECTION_STRING: str({
    desc: 'Connection string for your redis instance in the format of redis://<host>:<port> or redis://<username>:<password>@<host>:<port>',
    devDefault: env.REDIS_CONNECTION_STRING,
  }),
  RATE_LIMIT_TTL: num({
    desc: 'Rate limit window in seconds',
    default: 30,
  }),
  RATE_LIMIT_AUTHENTICATED: num({
    desc: 'Rate limit requests per window for authenticated users',
    default: 50,
  }),
  RATE_LIMIT_ANONYMOUS: num({
    desc: 'Rate limit requests per window for anonymous users',
    default: 20,
  }),
  USE_STREAMS: bool({
    desc: 'Enable streams sync',
    default: false,
  }),
  STREAMS_WEBHOOK_URL: str({
    desc: 'Webhook url for streams sync',
    default: '/streams',
  }),
});
