import fs = require('fs');
import express = require('express');
import jws = require('jws');

const conf = JSON.parse(String(fs.readFileSync('conf/conf.json')));
const keys: { [key: string]: string } = JSON.parse(String(fs.readFileSync(conf.keys)));

const app = express();
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '?' });

app.get('/*', (req, res) => {
  const signature = req.header('x-goog-iap-jwt-assertion');
  const decoded = jws.decode(signature);
  const kid = decoded.header.kid;
  const alg = decoded.header.alg;
  if (alg && keys[kid] && jws.verify(signature, alg, keys[kid])) {
    res.render('./index', {
      msg: 'Welcome!'
    });
  } else{
    res.render('./index', {
      msg: 'Unauthorized!'
    });
  }
});

app.listen(process.env.PORT || 3000);
