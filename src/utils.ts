//aca van las validaciones de los inputs

import { PlanType, User } from "./types"

export const parseUserId = ( userIdFromRequest: any ): number => {
    if(!isNumber(userIdFromRequest)){
        throw new Error('Incorrect or missing id')
    }
    return userIdFromRequest
}

const isNumber = (num: number): boolean => {
    return typeof num === 'number'
}

const isString = (str: string): boolean => { 
    return typeof str === 'string'
}

export const parseStringFromRequest = (str: string, minChars: number, maxChars: number): string => {
    console.log('str='+str+', minChars='+minChars+', maxChars='+maxChars)
    console.log('str.length='+str.length)
    if(!isString(str) || str.length < minChars || str.length > maxChars){
        throw new Error('Incorrect format or missing string')
    }
    return str
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

export const resHeaderConfig = (res: any, endpoint: string) => {
    res.header("Access-Control-Allow-Origin", endpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
}
