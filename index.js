const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 4000


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axlse.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log("Error Checking", err);
  const serviceCollection = client.db("CarbonHood").collection("services");
  const reviewCollection = client.db("CarbonHood").collection("reviews");
  const bookCollection = client.db("CarbonHood").collection("orderList");
  console.log('connected');
  

    app.post('/addService', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
        .then(result => {
            console.log('Added',result.insertedCount > 0);
            res.send(result.insertedCount > 0);
        })
    })
    


    app.get('/services', (req, res) => {
        serviceCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        serviceCollection.find({email: email})
        .toArray((err, admins) => {
            res.send(admins.length > 0);
        })

    })

    app.get('/services/:id', (req, res) =>{
        const id = req.params.id;
        serviceCollection.find({_id:ObjectID(id)})
        .toArray((err, documents)=>{
            res.send(documents[0])
        })
    })
    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id;
        console.log("Service deleted", id);
        serviceCollection.findOneAndDelete({_id: ObjectID(id)})
        .then((document) => res.send(document.deleteCount > 0))
    });
    



    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        reviewCollection.insertOne(newReview)
        .then(result => {
            console.log('Added',result.insertedCount > 0);
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.post('/addOrders', (req, res)=>{
        const newCheckout = req.body;
        bookCollection.insertOne(newCheckout)
        .then(result=> {
          console.log(result.insertedCount > 0);
        })
    })

    app.get('/orders', (req, res) => {
        bookCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

       app.get('/bookList', (req, res) => {
        bookCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


  

});











app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})