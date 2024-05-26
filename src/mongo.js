const mongoose = require('mongoose')
const connectionString = 'mongodb+srv://MyBandApp-Frankie:070793bsas@mybandappcluster.l8yireb.mongodb.net/?retryWrites=true&w=majority&appName=MyBandAppCluster'

mongoose.connect(connectionString)
.then(()=>{
    console.log("database connected")
}).catch(err => {
    console.error(err)
})

