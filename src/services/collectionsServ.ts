//import favouritesMock from './favouritesMock.json'
import { CollectionItem, CollectionItemEntry, CollectionSampleLibrary } from '../interfaces'
import { PlanType, Sample, SampleEntry } from '../types'
import collectionsMock from './collectionSamplesMock.json'
import { checkArrayOfSamplesExistDB, addSamplesListToDB } from './samplesServ'
import mongoose from 'mongoose'
const connectToDatabase = require('../mongo.js');
const CollectionModel = require('../models/Collections')

const collectionsLibrary: Array<CollectionSampleLibrary> = collectionsMock.collectionsLibrary as Array<CollectionSampleLibrary>

export const getCollectionsLibrary = (): Array<CollectionSampleLibrary> | undefined => {
    return collectionsLibrary
}

export const getCollectionByID = (id: string): CollectionSampleLibrary | undefined => {
    return collectionsLibrary.find(value => value.collectionId === id)
}

export const getSampleByID = (collectionId: string,sampleId: string): Sample | undefined => {

    const collection = collectionsLibrary.find(value => value.collectionId === collectionId)
    console.log(collection)
    if(collection === undefined) return collection

    const resSample = collection.sampleList.find(value=> value.sampleId === sampleId)
    console.log(resSample)
    
    return resSample
}

export const getCollectionsByPlan = (plan: PlanType): Array<CollectionSampleLibrary> | undefined => {
    return collectionsLibrary.filter(col => col.plan === plan)
}

export const getSamplesIdList = async (sampleList: Array<SampleEntry>): Promise<Array<string>> =>{
    console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].Init`)
    console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].sampleList=`,sampleList)
    console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].checkArrayOfSamplesExistDB.pre`)
    const samplesExist = await checkArrayOfSamplesExistDB(sampleList)
    console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].checkArrayOfSamplesExistDB.post`)
    if(samplesExist === false){
        console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].addSamplesListToDB.pre`)
        const result = await addSamplesListToDB(sampleList)
        console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].addSamplesListToDB.post`)
        console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].addSamplesListToDB.return=${result}`)
        return result
    }else{
        console.log(`${new Date()}.[collectionsServ].[getSamplesIdList].[MSG].Resp=Sample ya existe en la db`)
        throw new Error('Sample ya existe')
    }
}

export const addNewCollection = async (newCollectionEntry: CollectionItemEntry): Promise<CollectionItem> => {
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].Init`)
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].connectDB.post`)
    const collectionToDB = new CollectionModel(newCollectionEntry)
    console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].collectionToDB.save.pre`)
    return await collectionToDB.save().then((res: any)=>{
        console.log(`${new Date()}.[collectionsServ].[addNewCollection].[MSG].collectionToDB.save.res=`, res)
        mongoose.connection.close()
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[collectionsServ].[addUserToDB].[ERR].Error=`, err.message)
    })
}
/*
export const addNewFav = (userId: number, favEntry: SampleFav): SampleFav | boolean => {
    console.log('fav from userId:',userId)
    console.log('fav:', favEntry)
    var indexFav = favouritesList.findIndex(value => value.sampleId === favEntry.sampleId)
    if(indexFav < 0){
        favouritesList.push(favEntry)    
        return favEntry
    }else{
        return false
    }
}
*/
/*
export const deleteFav = (userId: number, sampleId: string): boolean => {
    console.log('fav from userId:',userId)
    console.log('fav sampleId:', sampleId)
    var indexDeleteFav = favouritesList.findIndex(value => value.sampleId === sampleId)
    if(indexDeleteFav >= 0){
        favouritesList.splice(indexDeleteFav, 1)
        return true
    }else{
        return false
    }
}
*/