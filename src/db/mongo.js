const mongoose = require('mongoose')
const { dbgConsoleLog, getStackFileName, errorConsoleLog } = require('../utils')
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
        errorConsoleLog(FILENAME, `[connectToDatabase].Error to connect database=`, error);
    }
}

const checkConnection = (dbConnection) => {
    switch (dbConnection.readyState) {
        case 0:
            dbgConsoleLog(FILENAME, '[checkConnection].state=disconnect');
            break;
        case 1:
            dbgConsoleLog(FILENAME, '[checkConnection].state=connect');
            break;
        case 2:
            dbgConsoleLog(FILENAME, '[checkConnection].state=connecting');
            break;
        case 3:
            dbgConsoleLog(FILENAME, '[checkConnection].state=disconnecting');
            break;
        default:
            dbgConsoleLog(FILENAME, '[checkConnection].state=unknow');
    }
};

const closeDatabaseConnection = () => {
    mongoose.connection.close(() => {
        dbgConsoleLog(FILENAME, `[connectToDatabase].[MSG]=Mongoose connection closed`)
    });
}
module.exports = {connectToDatabase, closeDatabaseConnection}
