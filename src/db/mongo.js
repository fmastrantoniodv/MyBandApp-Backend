const mongoose = require('mongoose')
const { dbgConsoleLog, getStackFileName } = require('../utils')
const FILENAME = getStackFileName()

const connectToDatabase = async () => {
    try {
        dbgConsoleLog(FILENAME, `[connectToDatabase].Init`)
        dbgConsoleLog(FILENAME, `[connectToDatabase].preConnect`)
        const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`
        checkConnection(mongoose.connection)
        await mongoose.connect(connectionString)
        checkConnection(mongoose.connection)
        dbgConsoleLog(FILENAME, `[connectToDatabase].[MSG]=Database connected`)
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

const closeDatabaseConnection = () => {
    mongoose.connection.close(() => {
        dbgConsoleLog(FILENAME, `[connectToDatabase].[MSG]=Mongoose connection closed`)
    });
}
module.exports = {connectToDatabase, closeDatabaseConnection}
