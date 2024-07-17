const SampleModel = require('../models/Samples')
import { SampleEntry } from '../types';
import { dbgConsoleLog, getStackFileName } from '../utils';
import { DBResponse } from '../interfaces';
const FILENAME = getStackFileName()

export const checkSampleExistDB = async ( sampleName: string, collectionCode: string): Promise<boolean> => {
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].Init`)
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].sampleName=${sampleName}, collectionCode=${collectionCode}`)
    return await SampleModel.find({sampleName: sampleName, collectionCode: collectionCode}).then((result: any) => {
        dbgConsoleLog(FILENAME, `[checkSampleExistDB].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            dbgConsoleLog(FILENAME, `[checkSampleExistDB].SampleModel.No existe sample con las caracteristicas ingresadas`)
            return false
        }else{
            return true
        }
    }).catch((err: any) => {
        console.error(`${new Date()}.[samplesServ].[checkSampleExistDB].[ERR].SampleModel.Find.catch`,err)
        return err
    })
}

export const addSamplesListToDB = async (newSamplesList: Array<SampleEntry>): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].Init`)
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].SampleModel.insertMany.pre`)
    return await SampleModel.insertMany(newSamplesList).then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addSamplesListToDB].SampleModel.insertMany.res=`, res)
        var arraySamplesId: Array<string> = []
        res.forEach((item: any) => {
            arraySamplesId.push(item._id)
        })
        resp.success = true
        resp.result = arraySamplesId
        return resp
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addSamplesListToDB].[ERR].Error=`, err.message)
        resp.success = false
        resp.result = err.message
        return resp
    })
}

export const addSampleToDB = async (newSample: SampleEntry) => {
    dbgConsoleLog(FILENAME, `[addSampleToDB].Init`)
    const sampleToDB = new SampleModel(newSample)
    dbgConsoleLog(FILENAME, `[addSampleToDB].SampleModel.save.pre`)
    await sampleToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addSampleToDB].SampleModel.save.res=`, res)
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
    })
    dbgConsoleLog(FILENAME, `[addUserToDB].SampleModel.save.post`)
}

export const checkExistsAndSaveToDB = async (newSamplesList: Array<SampleEntry>): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    const arraySamplesExist = []
    dbgConsoleLog(FILENAME, `[checkExistsAndSaveToDB].Init`)
    dbgConsoleLog(FILENAME, `[checkExistsAndSaveToDB].newSamplesList=`,newSamplesList)
    const query = newSamplesList.map(sample => ({
        sampleName: sample.sampleName,
        collectionCode: sample.collectionCode
      }));
    dbgConsoleLog(FILENAME, `[checkExistsAndSaveToDB].exists.pre`)
    for (const sample of query) {
        const exists = await SampleModel.exists({
            sampleName: sample.sampleName,
            collectionCode: sample.collectionCode
        });
        if(exists){
            dbgConsoleLog(FILENAME,`Sample already exists: ${sample.sampleName}, ${sample.collectionCode}`);
            arraySamplesExist.push(sample.sampleName)
        }
    }
    dbgConsoleLog(FILENAME, `[checkExistsAndSaveToDB].exists.post`)

    if(arraySamplesExist.length === 0){
        dbgConsoleLog(FILENAME, `[checkExistsAndSaveToDB].insertMany.pre`)
        await SampleModel.insertMany(newSamplesList).then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addSamplesListToDB].SampleModel.insertMany.res=`, res)
        var arraySamplesId: Array<string> = []
        res.forEach((item: any) => {
            arraySamplesId.push(item._id)
        })
        resp.success = true
        resp.result = arraySamplesId
        })
        .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addSamplesListToDB].[ERR].Error=`, err.message)
        resp.success = false
        resp.result = err.message
        })
    }else{
        resp.success = false
        resp.result = arraySamplesExist
    }
    return resp
}