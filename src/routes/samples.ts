import express from 'express'
import path from 'path'
import * as samplesServ from '../services/samplesServ'
const cors = require('cors')
import { parseNumberFromRequest, parseStringFromRequest, dbgConsoleLog, getStackFileName, errorConsoleLog } from '../utils'
import { SampleEntry } from '../types'
const FILENAME = getStackFileName()

const router = express.Router()
router.use(cors())

router.get('/:collectionId/:sampleName', async (req, res) => {
    try {
        dbgConsoleLog(FILENAME, `[samples].[get].[MSG].Init`)
        dbgConsoleLog(FILENAME, `[samples].[get].[MSG].sampleName=`, req.params.sampleName)
        dbgConsoleLog(FILENAME, `[samples].[get].[MSG].collectionId=`, req.params.collectionId)
        const collectionId = req.params.collectionId
        const filename = parseStringFromRequest(req.params.sampleName, 1, 100);
        const firstPath = path.resolve('./src')
        const audioPath = `${firstPath}/collections/${collectionId}/${collectionId+'_'+filename.toUpperCase().replace(' ','_')}.mp3`
        
        dbgConsoleLog(FILENAME, `[samples].[get].[MSG].filename=${filename}, audioPath=${audioPath}`)
        const headerOpts = {
          headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
          }
        };
        dbgConsoleLog(FILENAME, `[samples].[get].[MSG].sendFile.pre`)
        res.sendFile(audioPath, headerOpts, (err) => {
            if (err) {
              if (res.headersSent) {
                errorConsoleLog(FILENAME, 'Error al enviar el archivo después de que los encabezados fueron enviados:', err);
              } else {
                errorConsoleLog(FILENAME, 'Error al enviar el archivo:', err);
                if (err.name === 'ECANCELED') {
                  res.status(408).send('La solicitud fue cancelada por el cliente');
                } else {
                  res.status(500).send('Error al enviar el archivo');
                }
              }
            }
            dbgConsoleLog(FILENAME, `[samples].[get].[MSG].sendFile.se devuelve archivo=`,audioPath)
          });
          dbgConsoleLog(FILENAME, `[samples].[get].[MSG].sendFile.post`)
    } catch (error) {
        throw new Error('No se pudo obtener el audio')
    }
});

router.post('/addSample', async (req, res)=>{
  try {
    const { sampleName, collectionCode, duration, tempo } = req.body
    const newSampleEntry: SampleEntry = {
      sampleName: parseStringFromRequest(sampleName, 1, 50),
      collectionCode: parseStringFromRequest(collectionCode, 1, 100),
      duration: parseNumberFromRequest(duration, 0,600000),
      tempo: parseNumberFromRequest(tempo, 0, 999)
  }
  const newSample = await samplesServ.addNewSample(newSampleEntry)
  res.json(newSample)
  } catch (e: any) {
    res.status(400).send(e.message)
  }
})

export default router