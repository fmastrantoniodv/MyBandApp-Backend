const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');

const app = express();
const port = 3100;
const mongoURL = 'mongodb+srv://mybandappfrankieadmin:mybandtesting777@atlascluster.22fk4nm.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURL, { useUnifiedTopology:true});
const usersSchema = new mongoose.Schema({ id: 'number', nombre: 'string' });
const User = mongoose.model("User", usersSchema);

app.use(cors());
app.use(express.json());

app.post("/api/users", (req, res) => {
  let nuevoUser = req.body;
  console.log(nuevoUser);
  User.create(nuevoUser, (err, records) => {
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(records);
    }
  })
})

app.get('/api/users', (req, res) => {
  User.find(null, (err, records) => {
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(records);
    }
  });
})

app.get('/', (req, res) => {
  res.send('Backend->Hola mundo')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
