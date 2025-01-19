import express from 'express'
const cors = require('cors')
import { dbgConsoleLog, getPlanListParam, getStackFileName } from '../utils'

const FILENAME = getStackFileName()

const router = express.Router()
router.use(cors())

router.get('/getPlanList', async (_req, res) => {
    try {
        dbgConsoleLog(FILENAME, `[appConfig].[get].[MSG].Init`)
        const arrayPlanList = getPlanListParam()
        if(arrayPlanList !== 'ERROR'){
          res.status(200).json(arrayPlanList)
        }else{
          res.status(400).send('No se pudieron obtener los planes')
        }
    } catch (error) {
        throw new Error('No se pudieron obtener los planes')
    }
});

export default router