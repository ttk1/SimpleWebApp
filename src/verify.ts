import fs = require('fs');
import jws = require('jws');
import express = require('express');

/**
 * https://cloud.google.com/iap/docs/signed-headers-howto
 */
export function verify(conf: { [key: string]: string }): express.RequestHandler {
  const keys: { [key: string]: string } = JSON.parse(String(fs.readFileSync(conf.keys)));
  return (req, res, next): void => {
    try {
      const now = Date.now() / 1000;
      const signature = req.header('x-goog-iap-jwt-assertion');
      const decoded = jws.decode(signature);

      // 署名の検証

      const alg = decoded?.header?.alg;
      const kid = decoded?.header?.kid;
      if (!(alg && kid && keys[kid] && jws.verify(signature, alg, keys[kid]))) {
        throw new Error('invalid signature');
      }

      // ペイロードのチェック

      // 有効期限のチェック
      if (decoded.payload.exp < now) {
        throw new Error(`exp ${decoded.payload.exp} ${now}`);
      }
      // 発行時のチェック
      if (now < decoded.payload.iat) {
        throw new Error(`iat ${now} ${decoded.payload.exp}`);
      }
      // 対象のチェック
      if (decoded.payload.aud !== conf.aud) {
        throw new Error(`aud ${decoded.payload.aud} ${conf.aud}`);
      }
      // 発行元のチェック
      if (decoded.payload.iss !== conf.iss) {
        throw new Error(`iss ${decoded.payload.iss} ${conf.iss}`);
      }

      // ユーザIDの記録
      res.locals.sub = decoded.payload.sub;
      res.locals.email = decoded.payload.email;

      next();
    } catch (err) {
      console.error(err);
      res.status(401).send('Unauthorized!');
    }
  };
}
