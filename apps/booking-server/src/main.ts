import express from 'express';
import { env } from './config/env';

const app = express();
app.use(express.json());

// 简单健康检查
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'booking-service' });
});

// 业务路由(网关将把 /gw/test/booking 重写到 /booking)
app.get('/booking', (req, res) => {
  res.json({
    from: 'booking-service',
    method: 'GET',
    query: req.query,
    headers: {
      // 查看网关有没有透传这些头
      'x-forwarded-service': req.headers['x-forwarded-service'] || null,
      'x-request-id': req.headers['x-request-id'] || null,
      authorization: req.headers['authorization'],
    },
  });
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(Number(env.PORT), env.HOST, () => {
  console.log(`[ booking-service ] http://${env.HOST}:${env.PORT}`);
});
