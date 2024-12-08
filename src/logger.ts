const winston = require('winston')

export const logWriter = (type: string, stackFilename: string, msgToPrint: string, objectToPrint?: Object) => {
    const logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.simple()
        ),
        transports: [
            new winston.transports.File({
                filename: 'mba-back.log',
                level: 'info'
            })
        ]
    })
    
    if (process.env.ENV_CODE !== 'PROD') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()})
        )
    }

    if(objectToPrint !== undefined){
        logger.log(type, `[${new Date().toISOString()}].[${stackFilename}].${msgToPrint}`,objectToPrint)
    }else{
        logger.log(type, `[${new Date().toISOString()}].[${stackFilename}].${msgToPrint}`)
    }
}
