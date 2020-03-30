const express = require('express');
const app = express();
const config = require('config')
const path = require('path')

const PROT = config.get('port');

app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PROT, () => {
  console.log(`listening on port ${PROT}`);
})

