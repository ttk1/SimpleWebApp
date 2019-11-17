import fs = require('fs');
import express = require('express');
import jws = require('jws');

const conf = JSON.parse(String(fs.readFileSync('conf/conf.json')));
const keys: { [key: string]: string } = JSON.parse(String(fs.readFileSync(conf.keys)));

// https://cloud.google.com/iap/docs/signed-headers-howto?hl=ja
function verify(signature: string): jws.Signature {
  try {
    const now = Date.now() / 1000;
    const decoded = jws.decode(signature);

    // 署名の検証

    const alg = decoded?.header?.alg;
    const kid = decoded?.header?.kid;
    if (!(alg && kid && keys[kid] && jws.verify(signature, alg, keys[kid]))) {
      console.log('invalid signature');
      return null;
    }

    // ペイロードのチェック

    // 有効期限のチェック
    if (decoded.payload.exp < now) {
      console.log('exp', decoded.payload.exp, now);
      return null;
    }
    // 発行時のチェック
    if (now < decoded.payload.iat) {
      console.log('iat', now, decoded.payload.exp);
      return null;
    }
    // 対象のチェック
    if (decoded.payload.aud !== conf.aud) {
      console.log('aud', decoded.payload.aud, conf.aud);
      return null;
    }
    // 発行元のチェック
    if (decoded.payload.iss !== conf.iss) {
      console.log('iss', decoded.payload.iss, conf.iss);
      return null;
    }
    return decoded;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const app = express();
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '?' });

app.get('/*', (req, res) => {
  const signature = req.header('x-goog-iap-jwt-assertion');
  const decoded = verify(signature);
  if (decoded) {
    res.render('./index', {
      msg: 'Welcome!'
    });
  } else {
    res.render('./index', {
      msg: 'Unauthorized!'
    });
  }
});

app.listen(process.env.PORT || 3000);
