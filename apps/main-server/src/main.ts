import express from 'express';
import { env } from './config/env';

const host = process.env.HOST ?? 'localhost';
// const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(Number(env.PORT), host, () => {
  console.log(`[ ready ] http://${host}:${env.PORT}`);
});
