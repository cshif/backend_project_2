import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json('Aloha!');
});

export default app;
