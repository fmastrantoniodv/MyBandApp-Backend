const {connectToDatabase, closeDatabaseConnection} = require('./db/mongo.js');
import express, { Response, NextFunction } from 'express'
import projectsRouter from './routes/projects'
import collectionsRouter from './routes/collections'
import users from './routes/users'
import samples from './routes/samples'
import { dbgConsoleLog, getStackFileName } from './utils';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const portEnv: number = parseInt(process.env.PORT || '3001');
const FILENAME = getStackFileName()

const app = express()
app.use(express.json())

// Middleware para asignar un identificador único a cada request
app.use((req: any, res: Response, next: NextFunction) => {
    const requestId = uuidv4();
    req['requestId'] = requestId;      
    console.log(`Request ID: ${requestId}`);
    dbgConsoleLog(FILENAME, `req['requestId']=${req['requestId']}, req info=`, res.req.rawHeaders)
    next();
  });
  
app.use('/api/project', projectsRouter)
app.use('/api/collections', collectionsRouter)
app.use('/api/users', users)
app.use('/api/samples', samples)

app.listen(portEnv, async () =>{
    dbgConsoleLog(FILENAME, `Server running on port ${portEnv}`)
    dbgConsoleLog(FILENAME, `connectToDatabase.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `connectToDatabase.post`)
})

process.on('SIGINT', () => {
    dbgConsoleLog(FILENAME, `SIGINT signal received.`)
    dbgConsoleLog(FILENAME, `closeDatabaseConnection.pre`)
    closeDatabaseConnection();
    dbgConsoleLog(FILENAME, `closeDatabaseConnection.post`)
    process.exit(0);
});

process.on('SIGTERM', () => {
    dbgConsoleLog(FILENAME, 'SIGTERM signal received.');
    closeDatabaseConnection();
    process.exit(0);
});

// Manejador para errores no capturados
process.on('uncaughtException', (err) => {
    dbgConsoleLog(FILENAME, 'Uncaught Exception:', err);
    closeDatabaseConnection();
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
   dbgConsoleLog(FILENAME, `Unhandled Rejection at:', ${promise}, 'reason:', ${reason}`);
    closeDatabaseConnection();
    process.exit(1);
});