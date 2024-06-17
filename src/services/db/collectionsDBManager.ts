import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const CollectionModel = require('../../models/Collections')
import { CollectionItemEntry, DBResponse} from '../../interfaces'
import { dbgConsoleLog, getStackFileName } from '../../utils';

const FILENAME = getStackFileName()

export const addNewCollectionToDB = async (newCollectionEntry: CollectionItemEntry): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addNewCollection].Init`)
    dbgConsoleLog(FILENAME, `[addNewCollection].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addNewCollection].connectDB.post`)
    const collectionToDB = new CollectionModel(newCollectionEntry)
    dbgConsoleLog(FILENAME, `[addNewCollection].collectionToDB.save.pre`)
    return await collectionToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addNewCollection].collectionToDB.save.res=`, res)
        mongoose.connection.close()
        resp.success = true
        return resp
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[collectionsServ].[addUserToDB].[ERR].Error=`, err.message)
        resp.result = err.message
        return resp
    })
}

export const getCollectionByIDFromDB = async (collectionId: string): Promise<DBResponse> =>{
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].CollectionModel.find.pre`)
    return await CollectionModel.findOne({ _id: collectionId}).populate('sampleList').then((res: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].CollectionModel.find.res=`, res)
        if(res === null){
            resp.success = false
            resp.result = 'No se encontró collection'
        }else{
            resp.success = true
            resp.result = res
        }
        return resp
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[collectionsServ].[getCollectionByIDFromDB].[ERR].Error=`, err.message)
        resp.success = false
        resp.result = err.message
        return resp
    })
}