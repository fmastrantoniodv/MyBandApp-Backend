import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const SampleModel = require('../../models/Projects')
import { Sample, SampleEntry } from '../../types';

export const checkSampleExistDB = async ( sampleName: string, collectionCode: string): Promise<boolean> => {
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].sampleName=${sampleName}, collectionCode=${collectionCode}`)
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].connectDB.post`)
    return await SampleModel.find({sampleName: sampleName, collectionCode: collectionCode}).then((result: any) => {
        mongoose.connection.close()
        console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].SampleModel.No existe sample con las caracteristicas ingresadas`)
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
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].sampleList=`, sampleList)
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].connectDB.post`)
    const query = sampleList.map(sample => ({
        sampleName: sample.sampleName,
        collectionCode: sample.collectionCode
      }));
    return await SampleModel.find({ $or: query }).then((result: any) => {
        mongoose.connection.close()
        console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].SampleModel.No existen samples con las caracteristicas ingresadas`)
            return false
        }else{
            console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].SampleModel.Existen samples con las caracteristicas ingresadas`)
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
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].SampleModel.insertMany.pre`)
    return await SampleModel.insertMany(newSamplesList).then((res: any)=>{
        console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].SampleModel.insertMany.res=`, res)
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
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].connectDB.post`)
    const sampleToDB = new SampleModel(newSample)
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].SampleModel.save.pre`)
    await sampleToDB.save().then((res: any)=>{
        console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].SampleModel.save.res=`, res)
        mongoose.connection.close()
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
    })
    console.log(`${new Date()}.[samplesServ].[addUserToDB].[MSG].SampleModel.save.post`)
}
