import express = require('express');

const app = express();
app.use(express.static('html'));
app.listen(3000);
