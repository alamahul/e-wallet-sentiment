require('dotenv').config();
const createApp = require('./app');

const app = createApp();
// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('Backend running on port ' + PORT);
});

module.exports = app;
