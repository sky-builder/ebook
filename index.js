const express = require("express");
const app = express();
const config = require("config");
const path = require("path");
const admin = require('firebase-admin');
let serviceAccount = require('./ebook-272711-9039089b166f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

let docRef = db.collection('users').doc('alovelace');
let setAda = docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});

const PROT = config.get("port");

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PROT, () => {
  console.log(`listening on port ${PROT}`);
});
