import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const CollectionModel = require('../../models/Collections')
import { CollectionItem, CollectionItemEntry} from '../../interfaces'
import { dbgConsoleLog, getStackFileName } from '../../utils';

const FILENAME = getStackFileName()

export const addNewCollectionToDB = async (newCollectionEntry: CollectionItemEntry): Promise<boolean> => {
    dbgConsoleLog(FILENAME, `[addNewCollection].Init`)
    dbgConsoleLog(FILENAME, `[addNewCollection].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addNewCollection].connectDB.post`)
    const collectionToDB = new CollectionModel(newCollectionEntry)
    dbgConsoleLog(FILENAME, `[addNewCollection].collectionToDB.save.pre`)
    return await collectionToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addNewCollection].collectionToDB.save.res=`, res)
        mongoose.connection.close()
        return true
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[collectionsServ].[addUserToDB].[ERR].Error=`, err.message)
        return false
    })
}

export const getCollectionByIDFromDB = async (collectionId: string): Promise<CollectionItem | boolean> =>{
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].CollectionModel.find.pre`)
    return await CollectionModel.findOne({ _id: collectionId}).populate('sampleList').then((res: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].CollectionModel.find.res=`, res)
        if(res === null){
            return false
        }
        return res
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[collectionsServ].[getCollectionByIDFromDB].[ERR].Error=`, err.message)
        return false
    })
}