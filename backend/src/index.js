const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'e-wallet-sentiment-backend' });
});

app.listen(PORT, () => {
  console.log('Backend running on port ' + PORT);
});

module.exports = app;
