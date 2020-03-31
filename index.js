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

const PROT = config.get("port");
const PAGE_SIZE = config.get('pageSize')
const TOTAL_DOC_ID = config.get('totalDocId')

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded())

app.get("/", async (req, res) => {
  let { q, p } = req.query || {};
  let s = PAGE_SIZE;
  p = parseInt(p);
  if (isNaN(p)) p = 1;
  let query;
  if (q) {
    query = booksRef.where('name', '==', q).get()
  } else {
    if (p === 1) query = booksRef.orderBy('name').limit(s).get();
    else {
      let skipCount = (p - 1) * s;
      let first = booksRef.orderBy('name').limit(skipCount);
      let snapshot = await first.get();
      let last = snapshot.docs[snapshot.docs.length - 1];
      query = booksRef.orderBy('name').startAfter(last.data().name).limit(s).get();
    }
  }
  let totalQuery = booksRef.doc(TOTAL_DOC_ID).get()
  Promise.all([query, totalQuery])
  .then(data => {
    let books = []
    let [docs, totalDoc] = data;
    docs.forEach(doc => {
      books.push({
        ...doc,data(),
        id: doc.id,
      })
    })
    let totalCount = totalDoc.data().total;
    let payload = {
      books: books,
      q: q,
      p: p,
      s: s,
      totalPage: 
    }
    res.render('index', {books, q: q, totalPage: 2, s: 2, p: p});
  })
  query
  .then((snapshot) => {
    snapshot.forEach(doc => {
      books.push({
        ...doc.data(),
        id: doc.id
      });
    })
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
});
app.get('/books/:id', (req, res) => {
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

