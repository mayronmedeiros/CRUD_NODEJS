const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//choise view engine(EJS)
app.set('view engine', 'ejs')

// app.get('/',  (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// })

//METHOD POST
app.post('/quotes', (req, res) => {
  //SAVE THE BODY IN DB COLLECTION - QUOTES
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
  //SHOW CONSOLE RESULTS QUOTES BD
  db.collection('quotes').find().toArray(function(err, results) {
    console.log(results)
    // send HTML file populated with quotes here
  })

})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.json({ resposta: 'A darth vadar quote got deleted'})
  })
})


//GET THE BD COLLECTION AND VIEW IN INDEX.EJS
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) =>{ 
    if (err) return res.send(err)
    res.send(result)
  })
})




var db

MongoClient.connect('mongodb://admin:admin123@ds033607.mlab.com:33607/star-wars-quotes', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('Server ok')
  })
})

