import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const SampleModel = require('../../models/Projects')
import { Sample, SampleEntry } from '../../types';
import { dbgConsoleLog, getStackFileName } from '../../utils';
import { DBResponse } from '../../interfaces';
const FILENAME = getStackFileName()

export const checkSampleExistDB = async ( sampleName: string, collectionCode: string): Promise<boolean> => {
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].Init`)
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].sampleName=${sampleName}, collectionCode=${collectionCode}`)
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].connectDB.post`)
    return await SampleModel.find({sampleName: sampleName, collectionCode: collectionCode}).then((result: any) => {
        mongoose.connection.close()
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

export const checkArrayOfSamplesExistDB = async ( sampleList: Array<SampleEntry>): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].Init`)
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].sampleList=`, sampleList)
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].connectDB.post`)
    const query = sampleList.map(sample => ({
        sampleName: sample.sampleName,
        collectionCode: sample.collectionCode
      }));
    return await SampleModel.find({ $or: query }).then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].SampleModel.No existen samples con las caracteristicas ingresadas`)
            resp.success = true
            resp.result = 'OK'
        }else{
            dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].SampleModel.Existen samples con las caracteristicas ingresadas`)
            var sampleExistList: string = "";
            result.forEach((sampleExist: Sample) => {
                sampleExistList =+ ', '+sampleExist.sampleName
            });
            resp.success = true
            resp.result = `Ya existe el/los samples: ${sampleExistList}`
        }

        return resp
    }).catch((err: any) => {
        console.error(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[ERR].SampleModel.Find.catch`,err)
        resp.success = false
        resp.result = err.message
        return resp
    })
}

export const addSamplesListToDB = async (newSamplesList: Array<SampleEntry>): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].Init`)
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].SampleModel.insertMany.pre`)
    return await SampleModel.insertMany(newSamplesList).then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addSamplesListToDB].SampleModel.insertMany.res=`, res)
        mongoose.connection.close()
        var arraySamplesId: Array<string> = []
        res.forEach((item: any) => {
            arraySamplesId.push(item._id)
        })
        resp.success = true
        resp.result = arraySamplesId
        return resp
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
        resp.success = false
        resp.result = err.message
        return resp
    })
}

export const addSampleToDB = async (newSample: SampleEntry) => {
    dbgConsoleLog(FILENAME, `[addSampleToDB].Init`)
    dbgConsoleLog(FILENAME, `[addSampleToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addSampleToDB].connectDB.post`)
    const sampleToDB = new SampleModel(newSample)
    dbgConsoleLog(FILENAME, `[addSampleToDB].SampleModel.save.pre`)
    await sampleToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addSampleToDB].SampleModel.save.res=`, res)
        mongoose.connection.close()
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
    })
    dbgConsoleLog(FILENAME, `[addUserToDB].SampleModel.save.post`)
}
