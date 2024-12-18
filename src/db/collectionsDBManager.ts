const CollectionModel = require('../models/Collections')
import { PlanType } from '../types';
import { CollectionItemEntry, DBResponse} from '../interfaces'
import { dbgConsoleLog, getStackFileName, getScopePlan, errorConsoleLog } from '../utils';
const FILENAME = getStackFileName()

export const addNewCollectionToDB = async (newCollectionEntry: CollectionItemEntry): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addNewCollectionToDB].Init`)
    const collectionToDB = new CollectionModel(newCollectionEntry)
    dbgConsoleLog(FILENAME, `[addNewCollectionToDB].collectionToDB.save.pre`)
    return await collectionToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addNewCollectionToDB].collectionToDB.save.res=`, res)
        resp.success = true
        resp.result = res
        return resp
    })
    .catch((err:any)=>{
        errorConsoleLog(FILENAME, `[collectionsServ].[addUserToDB].Error=${err.message}`)
        resp.result = err.name
        return resp
    })
}

export const getCollectionByIDFromDB = async (collectionId: string): Promise<DBResponse> =>{
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getCollectionByIDFromDB].CollectionModel.find.pre`)
    return await CollectionModel.findOne({ _id: collectionId}).populate('sampleList').then((res: any)=>{
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
        errorConsoleLog(FILENAME, `[collectionsServ].[getCollectionByIDFromDB].Error=${err.message}`)
        resp.success = false
        resp.result = err.message
        return resp
    })
}

export const getCollectionsByPlanFromDB = async (plan: PlanType): Promise<DBResponse> =>{
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getCollectionsByPlanFromDB].CollectionModel.find.pre`)
    var planScope = getScopePlan(plan)
    return await CollectionModel.find({ plan: { $in: planScope } }).populate('sampleList').then((res: any)=>{
        dbgConsoleLog(FILENAME, `[getCollectionsByPlanFromDB].CollectionModel.find.res=`, res)
        if(res === null){
            resp.success = false
            resp.result = `No se encontraron collections con plan ${plan}`
        }else{
            resp.success = true
            resp.result = res
        }
        return resp
    })
    .catch((err:any)=>{
        errorConsoleLog(FILENAME, `[collectionsServ].[getCollectionsByPlanFromDB].Error=${err.message}`)
        resp.success = false
        resp.result = err.message
        return resp
    })
}

export const getAllCollectionsFromDB = async (): Promise<DBResponse> =>{
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getAllCollectionsFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getAllCollectionsFromDB].CollectionModel.find.pre`)
    return await CollectionModel.find({}).populate('sampleList').then((res: any)=>{
        dbgConsoleLog(FILENAME, `[getAllCollectionsFromDB].CollectionModel.find.res=`, res)
        if(res === null){
            resp.success = false
            resp.result = 'No se encontraron collections'
        }else{
            resp.success = true
            resp.result = res
        }
        return resp
    })
    .catch((err:any)=>{
        errorConsoleLog(FILENAME, `[collectionsServ].[getAllCollectionsFromDB].Error=`, err.message)
        resp.success = false
        resp.result = err.message
        return resp
    })
}