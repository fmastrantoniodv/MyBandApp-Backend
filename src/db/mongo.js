const mongoose = require('mongoose')
const connectionString = 'mongodb+srv://MyBandApp-Frankie:070793bsas@mybandappcluster.l8yireb.mongodb.net/?retryWrites=true&w=majority&appName=MyBandAppCluster'
const { dbgConsoleLog, getStackFileName } = require('../utils')
const FILENAME = getStackFileName()

const connectToDatabase = async () => {
    try {
        dbgConsoleLog(FILENAME, `[connectToDatabase].Init`)
        await mongoose.connect(connectionString)
        .then(()=>{
            dbgConsoleLog(FILENAME, `[connectToDatabase].[MSG]=Database connected`)
        }).catch(err => {
            console.error(err)
        })        
    } catch (error) {
        console.error(`[${FILENAME}].[connectToDatabase].[ERR].Error to connect database=`, error);
    }
}

module.exports = connectToDatabase
