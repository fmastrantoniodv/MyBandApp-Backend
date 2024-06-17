import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const SampleModel = require('../../models/Projects')
import { Sample, SampleEntry } from '../../types';
import { dbgConsoleLog, getStackFileName } from '../../utils';
const FILENAME = getStackFileName()

export const checkSampleExistDB = async ( sampleName: string, collectionCode: string): Promise<boolean> => {
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].[MSG].sampleName=${sampleName}, collectionCode=${collectionCode}`)
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[checkSampleExistDB].[MSG].connectDB.post`)
    return await SampleModel.find({sampleName: sampleName, collectionCode: collectionCode}).then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[checkSampleExistDB].[MSG].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            dbgConsoleLog(FILENAME, `[checkSampleExistDB].[MSG].SampleModel.No existe sample con las caracteristicas ingresadas`)
            return false
        }else{
            return true
        }
    }).catch((err: any) => {
        console.error(`${new Date()}.[samplesServ].[checkSampleExistDB].[ERR].SampleModel.Find.catch`,err)
        return err
    })
}

export const checkArrayOfSamplesExistDB = async ( sampleList: Array<SampleEntry>): Promise<boolean> => {
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].[MSG].sampleList=`, sampleList)
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].[MSG].connectDB.post`)
    const query = sampleList.map(sample => ({
        sampleName: sample.sampleName,
        collectionCode: sample.collectionCode
      }));
    return await SampleModel.find({ $or: query }).then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].[MSG].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].[MSG].SampleModel.No existen samples con las caracteristicas ingresadas`)
            return false
        }else{
            dbgConsoleLog(FILENAME, `[checkArrayOfSamplesExistDB].[MSG].SampleModel.Existen samples con las caracteristicas ingresadas`)
            var sampleExistList: string = "";
            result.forEach((sampleExist: Sample) => {
                sampleExistList =+ ', '+sampleExist.sampleName
            });
            throw new Error(`Ya existe el/los samples: ${sampleExistList}`)
        }
    }).catch((err: any) => {
        console.error(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[ERR].SampleModel.Find.catch`,err)
        return err
    })
}

export const addSamplesListToDB = async (newSamplesList: Array<SampleEntry>): Promise<Array<string>> => {
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].[MSG].connectDB.post`)
    dbgConsoleLog(FILENAME, `[addSamplesListToDB].[MSG].SampleModel.insertMany.pre`)
    return await SampleModel.insertMany(newSamplesList).then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addSamplesListToDB].[MSG].SampleModel.insertMany.res=`, res)
        mongoose.connection.close()
        var arraySamplesId: Array<string> = []
        res.forEach((item: any) => {
            arraySamplesId.push(item._id)
        })
        return arraySamplesId
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
    })
}

export const addSampleToDB = async (newSample: SampleEntry) => {
    dbgConsoleLog(FILENAME, `[addSampleToDB].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[addSampleToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addSampleToDB].[MSG].connectDB.post`)
    const sampleToDB = new SampleModel(newSample)
    dbgConsoleLog(FILENAME, `[addSampleToDB].[MSG].SampleModel.save.pre`)
    await sampleToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addSampleToDB].[MSG].SampleModel.save.res=`, res)
        mongoose.connection.close()
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
    })
    dbgConsoleLog(FILENAME, `[addUserToDB].[MSG].SampleModel.save.post`)
}
