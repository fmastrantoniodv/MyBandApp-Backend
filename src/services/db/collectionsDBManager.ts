import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const CollectionModel = require('../../models/Projects')
import { CollectionItemEntry} from '../../interfaces'

export const addNewCollectionToDB = async (newCollectionEntry: CollectionItemEntry): Promise<boolean> => {
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].Init`)
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].connectDB.post`)
    const collectionToDB = new CollectionModel(newCollectionEntry)
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].collectionToDB.save.pre`)
    return await collectionToDB.save().then((res: any)=>{
        console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].collectionToDB.save.res=`, res)
        mongoose.connection.close()
        return true
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[collectionsServ].[addUserToDB].[ERR].Error=`, err.message)
        return false
    })
}
