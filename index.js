const express = require("express");
const app = express();
const config = require("config");
const path = require("path");
const admin = require('firebase-admin');

var serviceAccount = require("./ebook-b6021-firebase-adminsdk-efxto-724656caf8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ebook-b6021.firebaseio.com"
});
let db = admin.firestore();

let booksRef = db.collection('books');


// let docRef = db.collection('users').doc('alovelace');
// let setAda = docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });
// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });

const PROT = config.get("port");

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let books = []
  booksRef.get()
  .then((snapshot) => {
    snapshot.forEach(doc => {
      books.push({
        ...doc.data(),
        id: doc.id
      });
    })
    console.log(books)
    res.render('index', {books})
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
});
app.get('/books/:id', (req, res) => {
  console.log(req.path, 'paht');
  let book;
  let { id } = req.params || {};
  booksRef.doc(id).get()
  .then((docRef) => {
    book = docRef.data();
    book.id = docRef.id;
    res.render('detail', {book})
  })
  .catch(err => {
    console.log(err)
  })
})

app.listen(PROT, () => {
  console.log(`listening on port ${PROT}`);
});

