import { ChannelConfig, PlanType, SoundListItem, User } from "./types"
import envParams from './envParams.json'
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

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
    console.log('channelList', channelList)
    channelList.forEach((channel: SoundListItem)=>{
        if(!isChannelListItemType(channel)){
            throw new Error('Incorrect format data from channelList')
        }
    })
    return channelList
}

export const parseStringFromRequest = (str: string, minChars: number, maxChars: number): string => {
    console.log('str='+str+', minChars='+minChars+', maxChars='+maxChars)
    console.log('str.length='+str.length)
    if(!isString(str) || str.length < minChars || str.length > maxChars){
        throw new Error('Incorrect format or missing string')
    }
    return str
}

export const parseNumberFromRequest = (num: number, minNumber: number, maxNumber: number): number => {
    console.log('num='+num+', minNumber='+minNumber+', maxNumber='+maxNumber)
    console.log('num.length='+num.toString().length)
    if(!isNumber(num) || num < minNumber || num > maxNumber){
        throw new Error('Incorrect format or missing number')
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
        throw new Error('Incorrect format or missing planType')
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
        throw new Error('Incorrect format or missing planType')
    }
    return str
}

export const resHeaderConfig = (res: any) => {
    res.header("Access-Control-Allow-Origin", frontendEndpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
}
