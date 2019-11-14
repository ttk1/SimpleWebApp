import express = require('express');

const app = express();
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('view options', {delimiter: '?'})
app.get('/', (req, res) => {
  res.render('./index', { msg: 'hello, world!' });
});
app.listen(process.env.PORT || 8080);
