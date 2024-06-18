import { SampleEntry } from '../types'
import { checkSampleExistDB, addSampleToDB } from '../db/samplesDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils'
import { checkArrayOfSamplesExistDB, addSamplesListToDB } from '../db/samplesDBManager'
import { ServResponse } from '../interfaces'
const FILENAME = getStackFileName()
console.log('####Init samplesServ#######')

export const addNewSample = async ( newSampleEntry: SampleEntry ): Promise<boolean>  => {
    dbgConsoleLog(FILENAME, `[addNewSample].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[addNewSample].[MSG].sample data entry:`,newSampleEntry)
    dbgConsoleLog(FILENAME, `[addNewSample].[MSG].checkSampleExistDB.pre`)
    const sampleExist = await checkSampleExistDB(newSampleEntry.sampleName, newSampleEntry.collectionCode)
    dbgConsoleLog(FILENAME, `[addNewSample].[MSG].checkSampleExistDB.post`)
    if(sampleExist === false){
        dbgConsoleLog(FILENAME, `[addNewSample].[MSG].addSampleToDB.pre`)
        await addSampleToDB(newSampleEntry)
        dbgConsoleLog(FILENAME, `[addNewSample].[MSG].addSampleToDB.post`)
        dbgConsoleLog(FILENAME, `[addNewSample].[MSG].addSampleToDB.return=true`)
        return true
    }else{
        dbgConsoleLog(FILENAME, `[addNewSample].[MSG].Resp=Sample ya existe en la db`)
        throw new Error('Sample ya existe')
    }
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

/*
export const getSampleByID = (collectionId: string,sampleId: string): Sample | undefined => {

    const collection = collectionsLibrary.find(value => value.collectionId === collectionId)
    console.log(collection)
    if(collection === undefined) return collection

    const resSample = collection.sampleList.find(value=> value.sampleId === sampleId)
    console.log(resSample)
    
    return resSample
}
*/