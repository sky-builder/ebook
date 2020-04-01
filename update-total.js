const admin = require('firebase-admin');
var serviceAccount = require("./ebook-b6021-firebase-adminsdk-efxto-724656caf8.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ebook-b6021.firebaseio.com"
});
let db = admin.firestore();

let booksRef = db.collection('books');

booksRef.get()
.then(snapshot => {
  let totalCount = snapshot.docs.length;
  totalCount -= 1;
  let doc = snapshot.docs.find(item => item.data().total > 0);
  if (doc) {
    console.log('old total: ', doc.data().total)
    console.log('new total: ', totalCount)
    booksRef.doc(doc.id).set({
      total: totalCount
    })
  }
})