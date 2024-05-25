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

export const parseStringFromRequest = (str: any): string => {
    if(!isString(str)){
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