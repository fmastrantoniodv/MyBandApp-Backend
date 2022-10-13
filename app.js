const mongoose = require('mongoose');
const express = require('express');
const usersModel = require('./api/models/users');
var cors = require('cors');

const app = express();
const port = 3100;
const mongoURL = 'mongodb+srv://mybandappfrankieadmin:mybandtesting777@atlascluster.22fk4nm.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURL, { useUnifiedTopology:true});

app.use(cors());
app.use(express.static(__dirname));

const users = [
  {
    "nombre": "frankie"
  },
  {
    "nombre": "jorge"
  }
];

app.post("/api/users", (req, res) => {
  let userData = req.body;
  console.log(userData);
  //let nuevoUser = {nombre: "Freddy"};
  //users.create(nuevoUser, (err, records) => {
  //  if(err){
  //    res.status(500).send(err);
  //  } else {
  //    res.status(200).send(records);
  //  }
  //})
})

app.get('/api/users', (req, res) => {
  res.json({
    users: users
  })
})

app.get('/', (req, res) => {
  res.send('Backend->Hola mundo')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
