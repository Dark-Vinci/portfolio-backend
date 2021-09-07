const express = require('express');
const app = express();
const winston = require('winston');

require('./appHelper')(app);

const port = process.env.PORT || 1212;
app.listen(port, () => winston.info(`listening at port ${ port }`));