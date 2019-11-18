import fs = require('fs');
import express = require('express');
import { verify } from './verify';

const conf = JSON.parse(String(fs.readFileSync('conf/conf.json')));

const app = express();
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '?' });
app.use(verify(conf));

app.get('/*', (req, res) => {
  res.render('./index', {
    msg: 'Welcome!'
  });
});

app.listen(process.env.PORT || 3000);
