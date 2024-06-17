import { CollectionSampleLibrary, CollectionItemEntry, CollectionItem, ServResponse } from '../interfaces'
import { PlanType, Sample, SampleEntry } from '../types'
import collectionsMock from '../mocks/collectionSamplesMock.json'
import { addNewCollectionToDB, getCollectionByIDFromDB } from './db/collectionsDBManager'
import { checkArrayOfSamplesExistDB, addSamplesListToDB } from './db/samplesDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils'

const FILENAME = getStackFileName()
const collectionsLibrary: Array<CollectionSampleLibrary> = collectionsMock.collectionsLibrary as Array<CollectionSampleLibrary>

export const getCollectionsLibrary = (): Array<CollectionSampleLibrary> | undefined => {
    return collectionsLibrary
}

export const getCollectionByID = async (collectionId: string): Promise<ServResponse> => {
    dbgConsoleLog(FILENAME, `[getCollectionByID].Init`)
    dbgConsoleLog(FILENAME, `[getCollectionByID].collectionId=`,collectionId)
    dbgConsoleLog(FILENAME, `[getCollectionByID].getCollectionByIDFromDB.pre`)
    const collectionFromDB = await getCollectionByIDFromDB(collectionId)
    dbgConsoleLog(FILENAME, `[getCollectionByID].getCollectionByIDFromDB.post`)
    dbgConsoleLog(FILENAME, `[getCollectionByID].getCollectionByIDFromDB.collectionFromDB=${collectionFromDB}`)
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

export const getSamplesIdList = async (sampleList: Array<SampleEntry>): Promise<ServResponse> =>{
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[getSamplesIdList].Init`)
    dbgConsoleLog(FILENAME, `[getSamplesIdList].sampleList=`,sampleList)
    dbgConsoleLog(FILENAME, `[getSamplesIdList].checkArrayOfSamplesExistDB.pre`)
    const samplesExistRes = await checkArrayOfSamplesExistDB(sampleList)
    dbgConsoleLog(FILENAME, `[getSamplesIdList].checkArrayOfSamplesExistDB.post`)
    if(samplesExistRes.success === true && samplesExistRes.result === 'OK'){
        dbgConsoleLog(FILENAME, `[getSamplesIdList].addSamplesListToDB.pre`)
        const addSamplesResult = await addSamplesListToDB(sampleList)
        dbgConsoleLog(FILENAME, `[getSamplesIdList].addSamplesListToDB.post`)
        dbgConsoleLog(FILENAME, `[getSamplesIdList].addSamplesListToDB.return=${addSamplesResult}`)
        resp.success = true
        resp.result = addSamplesResult.result
    }else{
        dbgConsoleLog(FILENAME, `[getSamplesIdList].Resp=Sample ya existe en la db`)
        resp.success = false
        resp.result = "Sample ya existe"
    }
    return resp
}

export const createCollection = async (newCollectionEntry: CollectionItemEntry): Promise<ServResponse> =>{
    dbgConsoleLog(FILENAME, `[createCollection].Init`)
    dbgConsoleLog(FILENAME, `[createCollection].checkArrayOfSamplesExistDB.pre`)
    const dbResponse = await addNewCollectionToDB(newCollectionEntry)
    dbgConsoleLog(FILENAME, `[createCollection].checkArrayOfSamplesExistDB.post`)
    return dbResponse
}

