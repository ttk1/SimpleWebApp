import fs = require('fs');
import express = require('express');
import { Firestore } from '@google-cloud/firestore';
import { verify } from './verify';

const conf = JSON.parse(String(fs.readFileSync('conf/conf.json')));
const firestore = new Firestore();

const app = express();
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '?' });
app.use(verify(conf));

app.get('/*', async (req, res) => {
  const document = firestore.doc('test01/doc01');
  const doc = await document.get();
  res.render('./index', {
    msg: doc.get('msg')
  });
});

app.listen(process.env.PORT || 3000);
