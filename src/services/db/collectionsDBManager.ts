import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const CollectionModel = require('../../models/Collections')
import { CollectionItem, CollectionItemEntry} from '../../interfaces'

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

export const getCollectionByIDFromDB = async (collectionId: string): Promise<CollectionItem | boolean> =>{
    console.log(`${new Date()}.[collectionsServ].[getCollectionByIDFromDB].[MSG].Init`)
    console.log(`${new Date()}.[collectionsServ].[getCollectionByIDFromDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[collectionsServ].[getCollectionByIDFromDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[collectionsServ].[getCollectionByIDFromDB].[MSG].CollectionModel.find.pre`)
    return await CollectionModel.findOne({ _id: collectionId}).populate('sampleList').then((res: any)=>{
        mongoose.connection.close()
        console.log(`${new Date()}.[collectionsServ].[getCollectionByIDFromDB].[MSG].CollectionModel.find.res=`, res)
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