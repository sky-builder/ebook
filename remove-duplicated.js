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
  let docs = snapshot.docs;
  let dupMap = {};
  for(let i = 0; i < docs.length; i += 1) {
    let arr = [];
    if (dupMap[docs[i].data().name]) continue;
    for(let j = 0; j < docs.length; j += 1) {
      if (docs[i].data().name === docs[j].data().name) {
        arr.push(docs[j]);
      }
    }
    if (arr.length > 1) {
      dupMap[arr.pop().data().name] = true;
      arr.forEach(item => {
        booksRef.doc(item.id).delete()
      })
    }
  }
  console.log('duplicated books: ', dupMap);
})