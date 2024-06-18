import { CollectionItemEntry, ServResponse } from '../interfaces'
import { PlanType } from '../types'
import { addNewCollectionToDB, getAllCollectionsFromDB, getCollectionByIDFromDB, getCollectionsByPlanFromDB } from '../db/collectionsDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils'

const FILENAME = getStackFileName()

export const getCollections = async (plan?: PlanType): Promise<ServResponse> => {
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[getCollections].Init`)
    dbgConsoleLog(FILENAME, `[getCollections].plan=${plan}`)
    var collectionsFromDB 
    if(plan === undefined){
        dbgConsoleLog(FILENAME, `[getCollections].getAllCollectionsFromDB.pre`)
        collectionsFromDB = await getAllCollectionsFromDB()
        dbgConsoleLog(FILENAME, `[getCollections].getAllCollectionsFromDB.post`)
    }else{
        dbgConsoleLog(FILENAME, `[getCollections].getCollectionsByPlanFromDB.pre`)
        collectionsFromDB = await getCollectionsByPlanFromDB(plan)
        dbgConsoleLog(FILENAME, `[getCollections].getCollectionsByPlanFromDB.post`)
    }
    resp.success = true
    resp.result = collectionsFromDB.result
    dbgConsoleLog(FILENAME, `[getCollections].result=`, resp)
    return resp
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

export const createCollection = async (newCollectionEntry: CollectionItemEntry): Promise<ServResponse> =>{
    dbgConsoleLog(FILENAME, `[createCollection].Init`)
    dbgConsoleLog(FILENAME, `[createCollection].checkArrayOfSamplesExistDB.pre`)
    const dbResponse = await addNewCollectionToDB(newCollectionEntry)
    dbgConsoleLog(FILENAME, `[createCollection].checkArrayOfSamplesExistDB.post`)
    return dbResponse
}

