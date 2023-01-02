import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import config from './config';
import { parseServer } from './parseServer';
// @ts-ignore
import ParseServer from 'parse-server';
import http from 'http';
import ngrok from 'ngrok';
//import { streamsSync } from '@moralisweb3/parse-server';
const {verifySignature, parseEventData, parseUpdate} = require('./helpers/utils');

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

/* app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY,
    webhookUrl: '/streams',
  }),
); */

app.post('/streams', async (req: any, res: any) => {
  console.log("body", req.body);
  try {
    verifySignature(req, config.MORALIS_API_KEY);
    const { data, tagName }: any = parseEventData(req);
    await parseUpdate(`${tagName}`, data);
  } catch (e) {
    console.log(e);
  }
  res.send('ok');
});

app.use(`/server`, parseServer.app);

const httpServer = http.createServer(app);
httpServer.listen(config.PORT, async () => {
  if (config.USE_STREAMS) {
    const url = await ngrok.connect(config.PORT);
    // eslint-disable-next-line no-console
    console.log(
      `Moralis Server is running on port ${config.PORT} and stream webhook url ${url}${config.STREAMS_WEBHOOK_URL}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`Moralis Server is running on port ${config.PORT}.`);
  }
});
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);