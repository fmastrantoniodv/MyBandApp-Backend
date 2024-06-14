const mongoose = require('mongoose')
//const connectionString = 'mongodb+srv://MyBandApp-Frankie:070793bsas@mybandappcluster.l8yireb.mongodb.net/?retryWrites=true&w=majority&appName=MyBandAppCluster'
const connectionString = 'mongodb+srv://MyBandApp-Cande:ofmbWEdsD8z6rZch@mybandappcluster.l8yireb.mongodb.net/?retryWrites=true&w=majority&appName=MyBandAppCluster'

const connectToDatabase = async () => {
    try {
        await mongoose.connect(connectionString)
        .then(()=>{
            console.log("[mongo].[connectToDatabase].[MSG]=Database connected")
        }).catch(err => {
            console.error(err)
        })        
    } catch (error) {
        console.error("[mongo].[connectToDatabase].[ERR].Error to connect database=", error);
    }
}

module.exports = connectToDatabase
