import { CollectionSampleLibrary, CollectionItemEntry, CollectionItem } from '../interfaces'
import { PlanType, Sample, SampleEntry } from '../types'
import collectionsMock from '../mocks/collectionSamplesMock.json'
import { addNewCollectionToDB, getCollectionByIDFromDB } from './db/collectionsDBManager'
import { checkArrayOfSamplesExistDB, addSamplesListToDB } from './db/samplesDBManager'

const collectionsLibrary: Array<CollectionSampleLibrary> = collectionsMock.collectionsLibrary as Array<CollectionSampleLibrary>

export const getCollectionsLibrary = (): Array<CollectionSampleLibrary> | undefined => {
    return collectionsLibrary
}

export const getCollectionByID = async (collectionId: string): Promise<CollectionItem | boolean> => {
    console.log(`${new Date()}.[collectionsServ].[getCollectionByID].[MSG].Init`)
    console.log(`${new Date()}.[collectionsServ].[getCollectionByID].[MSG].collectionId=`,collectionId)
    console.log(`${new Date()}.[collectionsServ].[getCollectionByID].[MSG].getCollectionByIDFromDB.pre`)
    const collectionFromDB: CollectionItem | boolean = await getCollectionByIDFromDB(collectionId)
    console.log(`${new Date()}.[collectionsServ].[getCollectionByID].[MSG].getCollectionByIDFromDB.post`)
    console.log(`${new Date()}.[collectionsServ].[getCollectionByID].[MSG].getCollectionByIDFromDB.collectionFromDB=${collectionFromDB}`)
    return collectionFromDB
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

export const createCollection = async (newCollectionEntry: CollectionItemEntry): Promise<boolean> =>{
    console.log(`${new Date()}.[collectionsServ].[createCollection].[MSG].Init`)
    console.log(`${new Date()}.[collectionsServ].[createCollection].[MSG].checkArrayOfSamplesExistDB.pre`)
    const dbResponse = await addNewCollectionToDB(newCollectionEntry)
    console.log(`${new Date()}.[collectionsServ].[createCollection].[MSG].checkArrayOfSamplesExistDB.post`)
    return dbResponse
}

