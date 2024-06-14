import { SampleEntry } from '../types'
import { checkSampleExistDB, addSampleToDB } from './db/samplesDBManager'

console.log('####Init samplesServ#######')

export const addNewSample = async ( newSampleEntry: SampleEntry ): Promise<boolean>  => {
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].sample data entry:`,newSampleEntry)
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].checkSampleExistDB.pre`)
    const sampleExist = await checkSampleExistDB(newSampleEntry.sampleName, newSampleEntry.collectionCode)
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].checkSampleExistDB.post`)
    if(sampleExist === false){
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].addSampleToDB.pre`)
        await addSampleToDB(newSampleEntry)
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].addSampleToDB.post`)
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].addSampleToDB.return=true`)
        return true
    }else{
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].Resp=Sample ya existe en la db`)
        throw new Error('Sample ya existe')
    }
}
