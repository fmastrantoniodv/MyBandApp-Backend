import express from 'express'
import path from 'path'
import * as samplesServ from '../services/samplesServ'
const cors = require('cors')
import { parseNumberFromRequest, parseStringFromRequest, parseDBObjectId } from '../utils'
import { SampleEntry } from '../types'
//import envParams from '../envParams.json'

const router = express.Router()
//const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string
router.use(cors())

router.get('/:collectionId/:sampleId', async (req, res) => {
    try {
        console.log(`${new Date()}.[samples].[get].[MSG].Init`)
        console.log(`${new Date()}.[samples].[get].[MSG].sampleId=`, req.params.sampleId)
        console.log(`${new Date()}.[samples].[get].[MSG].collectionId=`, req.params.collectionId)
        const collectionId = req.params.collectionId
        const filename = parseDBObjectId(req.params.sampleId);
        const firstPath = path.resolve('./src')
        const audioPath = path.join(firstPath, '/collections/',collectionId+'/', filename+'.mp3');
        console.log(`${new Date()}.[samples].[get].[MSG].filename=${filename}, audioPath=${audioPath}`)
        const headerOpts = {
          headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
          }
        };
        console.log(`${new Date()}.[samples].[get].[MSG].sendFile.pre`)
        res.sendFile(audioPath, headerOpts, (err) => {
            if (err) {
              if (res.headersSent) {
                console.error('Error al enviar el archivo después de que los encabezados fueron enviados:', err);
              } else {
                console.error('Error al enviar el archivo:', err);
                if (err.name === 'ECANCELED') {
                  res.status(408).send('La solicitud fue cancelada por el cliente');
                } else {
                  res.status(500).send('Error al enviar el archivo');
                }
              }
            }
            console.log(`${new Date()}.[samples].[get].[MSG].sendFile.se devuelve archivo=`,audioPath)
          });
          console.log(`${new Date()}.[samples].[get].[MSG].sendFile.post`)
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