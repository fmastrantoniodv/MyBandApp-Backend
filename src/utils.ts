//aca van las validaciones de los inputs

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
