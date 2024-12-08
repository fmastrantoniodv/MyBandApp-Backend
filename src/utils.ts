import { ChannelConfig, PlanType, SoundListItem, User } from "./types"
import { logWriter } from './logger'

const isNumber = (num: number): boolean => {
    return typeof num === 'number'
}
const isString = (str: string): boolean => { 
    return typeof str === 'string'
}

const isChannelListItemType = (soundListItem: SoundListItem): soundListItem is SoundListItem => {
    return typeof soundListItem === 'object' &&
    typeof soundListItem.sampleId === 'string' &&
    isChannelConfigType(soundListItem.channelConfig)
}

const setThrowError = (codeError:string, messageError: string): Error => {
    const returnError = new Error()
    returnError.name = codeError
    returnError.message = messageError
    return returnError
}

export const setErrorResponse = (res: any, errorCode: string, errorDetail: string) => {
    res.json({
        errorCode: errorCode,
        errorDetail: errorDetail
    })
}

export const catchErrorResponse = (res: any, e: Error) => {
    if(e.name === 'INPUT_VALIDATION'){
        res.status(400)
        setErrorResponse(res, e.name, e.message)
    }else{
        res.status(500).send('Internal server error')
    }
}

const isChannelConfigType = (channelConfig: ChannelConfig): channelConfig is ChannelConfig => {
    return typeof channelConfig === 'object' &&
    typeof channelConfig.volume === 'number' &&
    typeof channelConfig.EQ === 'object' &&
    typeof channelConfig.EQ.high === 'number' &&
    typeof channelConfig.EQ.mid === 'number' &&
    typeof channelConfig.EQ.low === 'number' &&
    typeof channelConfig.states === 'object' &&
    typeof channelConfig.states.muted === 'boolean' &&
    typeof channelConfig.states.solo === 'boolean'
}

export const parseChannelList = (channelList: Array<SoundListItem>): Array<SoundListItem> =>{
    dbgConsoleLog(getStackFileName(),'[parseChannelList].channelList=', channelList)
    channelList.forEach((channel: SoundListItem)=>{
        if(!isChannelListItemType(channel)){            
            throw setThrowError('INPUT_VALIDATION', 'Incorrect format data from channelList')
        }
    })
    return channelList
}

export const parseStringFromRequest = (str: string, minChars: number, maxChars: number): string => {
    dbgConsoleLog(getStackFileName(), '[parseStringFromRequest].str='+str+', minChars='+minChars+', maxChars='+maxChars+', str.length='+str.length)
    if(!isString(str) || str.length < minChars || str.length > maxChars){
        throw setThrowError('INPUT_VALIDATION', 'Incorrect format or missing string')
    }
    return str
}

export const parseNumberFromRequest = (num: number, minNumber: number, maxNumber: number): number => {
    dbgConsoleLog(getStackFileName(),'num='+num+', minNumber='+minNumber+', maxNumber='+maxNumber+' num.length='+num.toString().length)
    if(!isNumber(num) || num < minNumber || num > maxNumber){
        dbgConsoleLog(getStackFileName(), `${num} isn't num or < ${minNumber} or > ${maxNumber}`)
        throw setThrowError('INPUT_VALIDATION', 'Incorrect format or missing number')
    }
    return num
}

const isPlanType = (value: string): value is PlanType => {
    return Object.values(PlanType).includes(value as PlanType);
}

export const isUser = (obj: any): obj is User => {
    return typeof obj === 'object' &&
           obj !== null &&
           typeof obj.name === 'string' &&
           typeof obj.age === 'number';
}

export const parsePlanType = (str: any): PlanType => {
    if(!isPlanType(str)){
        throw setThrowError('INPUT_VALIDATION', 'Incorrect format or missing planType')
    }
    return str
}

export const calculateExpirationDate = (plan: PlanType, regDate: Date): Date =>{
    var expDate = new Date(regDate)
    if(plan === PlanType.Pro){
        expDate.setFullYear(regDate.getFullYear() + 1)
    }else if(plan === PlanType.Trial){
        expDate.setMonth(expDate.getMonth() + 1);
    }else{
        expDate.setFullYear(regDate.getFullYear() + 100)
    }
    return expDate
}

export const parseDBObjectId = (str: string) => {
    if(str.length !== 24){
        throw setThrowError('INPUT_VALIDATION', 'Incorrect format input id')
    }
    return str
}

export const resHeaderConfig = (res: any) => {
    const frontendEndpoint: string = (process.env.ALLOWED_DOMAINS || '')
    res.header("Access-Control-Allow-Origin", frontendEndpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    //res.set('Allow', 'GET, POST, OPTIONS');    
}

export const dbgConsoleLog = (location: string, message: string, obj?: Object) => {
    process.env.DB_USER
    if(obj === undefined){
        logWriter('info', location, message)
    }else{
        logWriter('info', location, message, obj)
    }
}

export const errorConsoleLog = (location: string, message: string, obj?: Object) => {
    if(obj === undefined){
        logWriter('error', location, message)
    }else{
        logWriter('error', location, message, obj)
    }
}

export const getStackFileName = () => {
    const error = new Error();
    var nombreArchivo
    if(error.stack !== undefined){
        const stack = error.stack.split('\n');   
        const llamada = stack[2];
        const match = llamada.match(/(?:\()?(.*?):(\d+):\d+(?:\))?/);
        if (match && match[1]) {
            const rutaArchivo = match[1];
            nombreArchivo = rutaArchivo.split('\\').pop();
        }
    }
    if(nombreArchivo === undefined){
        nombreArchivo = ''
    }

    return nombreArchivo
}

export const getScopePlan = (plan: PlanType) => {    
    const planList: Array<string> = (process.env.ACTIVE_PLAN_LIST || '').split(',')
    dbgConsoleLog(getStackFileName(), `[getScopePlan].plan input param=${plan}, planList=`, planList)
    const indexPlan = planList.indexOf(plan);
    if (indexPlan === -1) {
      return [];
    }
    // Retornar todos los elementos con un índice menor al índice de referencia
    return planList.slice(0, indexPlan+1);
  }
  
export const generateVerificationCode = () =>{
    return Math.floor(10000000 + Math.random() * 90000000); // Genera un número entre 10000000 y 99999999
  }
  