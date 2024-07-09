const mongoose = require('mongoose')
const connectionString = 'mongodb+srv://MyBandApp-Frankie:070793bsas@mybandappcluster.l8yireb.mongodb.net/?retryWrites=true&w=majority&appName=MyBandAppCluster'
const { dbgConsoleLog, getStackFileName } = require('../utils')
const FILENAME = getStackFileName()

const connectToDatabase = async () => {
    try {
        dbgConsoleLog(FILENAME, `[connectToDatabase].Init`)
        dbgConsoleLog(FILENAME, `[connectToDatabase].preConnect`)
        checkConnection(mongoose.connection)
        await mongoose.connect(connectionString)
        checkConnection(mongoose.connection)
        dbgConsoleLog(FILENAME, `[connectToDatabase].[MSG]=Database connected`)
        console.error(err)
    } catch (error) {
        console.error(`[${FILENAME}].[connectToDatabase].[ERR].Error to connect database=`, error);
    }
}

const checkConnection = (dbConnection) => {
    switch (dbConnection.readyState) {
        case 0:
            console.log('Desconectado');
            break;
        case 1:
            console.log('Conectado');
            break;
        case 2:
            console.log('Conectando');
            break;
        case 3:
            console.log('Desconectando');
            break;
        default:
            console.log('Estado desconocido');
    }
};
module.exports = connectToDatabase
