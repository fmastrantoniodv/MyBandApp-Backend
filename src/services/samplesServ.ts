import { SampleEntry } from '../types'
import { checkSampleExistDB, addSampleToDB } from '../db/samplesDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils'
import { checkExistsAndSaveToDB } from '../db/samplesDBManager'
import { ServResponse } from '../interfaces'
const FILENAME = getStackFileName()

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
    dbgConsoleLog(FILENAME, `[getSamplesIdList].checkExistsAndSaveToDB.pre`)
    const samplesExistRes = await checkExistsAndSaveToDB(sampleList)
    dbgConsoleLog(FILENAME, `[getSamplesIdList].checkExistsAndSaveToDB.post`)
    if(samplesExistRes.success === true){
        resp.success = true
    }else{
        dbgConsoleLog(FILENAME, `[getSamplesIdList].Resp=Sample ya existe en la db`)
    }
    resp.result = samplesExistRes.result
    return resp
}
