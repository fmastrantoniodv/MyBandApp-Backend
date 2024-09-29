import express from 'express'
import path from 'path'
import * as collectionsServ from '../services/collectionsServ'
import * as samplesServ from '../services/samplesServ'
import {parseStringFromRequest, parsePlanType, resHeaderConfig, parseDBObjectId, dbgConsoleLog, getStackFileName, errorConsoleLog} from '../utils'
import { CollectionItemEntry } from '../interfaces'

const router = express.Router()
const FILENAME = getStackFileName()
const cors = require('cors')
router.use(cors())

//#### Get collections
router.get('/', async (_req, res) => {
    try {
        resHeaderConfig(res)
        dbgConsoleLog(FILENAME, `[GET].Init`)
        dbgConsoleLog(FILENAME, `[GET].getCollections.pre`)
        const resCollectionsList = await collectionsServ.getCollections()
        dbgConsoleLog(FILENAME, `[GET].getCollections.post`)
        dbgConsoleLog(FILENAME, `[GET].getCollections.result=`,resCollectionsList)
        if(resCollectionsList.success){
            res.status(200).json(resCollectionsList.result)
        }else{
            res.status(400).send('No se encontraron collections')
        }
    } catch (error) {
        res.status(500).send("Error interno")
    }
})

router.get('/src/:collectionCode', async (req, res) => {
    try {
        dbgConsoleLog(FILENAME, `[get].[MSG].Init`)
        dbgConsoleLog(FILENAME, `[get].[MSG].collectionCode=`, req.params.collectionCode)
        const collectionCode = req.params.collectionCode
        const firstPath = path.resolve('./src')
        const audioPath = `${firstPath}/collections/${collectionCode}/avatar.png`
        
        dbgConsoleLog(FILENAME, `[get].[MSG].audioPath=${audioPath}`)
        const headerOpts = {
          headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
          }
        };
        dbgConsoleLog(FILENAME, `[get].[MSG].sendFile.pre`)
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
            dbgConsoleLog(FILENAME, `[get].[MSG].sendFile.se devuelve archivo=`,audioPath)
          });
          dbgConsoleLog(FILENAME, `[get].[MSG].sendFile.post`)
    } catch (error) {
        throw new Error('No se pudo obtener la imagen')
    }
});


//#### Get collection by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        resHeaderConfig(res)
        dbgConsoleLog(FILENAME, `[GET]/id=${id}.Init`)
        dbgConsoleLog(FILENAME, `[GET]/id=${id}.getCollectionByID.pre`)
        const resCollection = await collectionsServ.getCollectionByID(parseDBObjectId(id))
        dbgConsoleLog(FILENAME, `[GET]/id=${id}.getCollectionByID.post`)
        dbgConsoleLog(FILENAME, `[GET]/id=${id}.getCollectionByID.resCollection=`, resCollection)
        if(resCollection.success === false){
            res.status(404).send(resCollection.result)
        }else{
            res.status(200).json(resCollection.result)
        }
    } catch (error) {
        res.status(500).send("Error interno")
    }  
})

//#### Get collections by plan
router.get('/plan/:plan', async (req, res) => {
    try{
        const { plan } = req.params
        resHeaderConfig(res)
        dbgConsoleLog(FILENAME, `[GET]/plan=${plan}.Init`)
        dbgConsoleLog(FILENAME, `[GET]/plan=${plan}.getCollections.pre`)
        const resCollection = await collectionsServ.getCollections(parsePlanType(plan))
        dbgConsoleLog(FILENAME, `[GET]/plan=${plan}.getCollections.post`)
        dbgConsoleLog(FILENAME, `[GET]/plan=${plan}.resCollection=`, resCollection)
        if(resCollection.result.length === 0){
            res.status(200).send("No se encontraron collections con el plan declarado")
        }else{
            res.status(200).json(resCollection.result)
        }
    }catch (e: any) {
        res.status(400).send(e.message)
    }
})

router.post('/addCollection', async (req, res) => {
    try{
        const { collectionCode, collectionName, plan, sampleList, tags, templateId, templateName } = req.body
        resHeaderConfig(res)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.REQ=`, req.body)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.getSamplesIdList.pre`)
        const samplesIdList = await samplesServ.getSamplesIdList(sampleList)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.getSamplesIdList.post`)
        if(!samplesIdList.success){
            return res.status(400).send(`Ya exiten los samples: ${samplesIdList.result}`)
        }
        const newCollectionEntry: CollectionItemEntry = {
            collectionCode: parseStringFromRequest(collectionCode, 0, 100),
            collectionName: parseStringFromRequest(collectionName, 0, 100),
            uploadDate: new Date(),
            plan: parsePlanType(plan),
            sampleList: samplesIdList.result,
            tags: tags
        }

        if(templateId != undefined){
            newCollectionEntry.templateId = parseDBObjectId(templateId)
            newCollectionEntry.templateName = parseStringFromRequest(templateName, 1, 100)
        }

        dbgConsoleLog(FILENAME, `[POST]/addCollection.createCollection.pre.newCollectionEntry=`, newCollectionEntry)
        const result = await collectionsServ.createCollection(newCollectionEntry)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.createCollection.post.result=${result}`)
        if(result.success){
            return res.status(200).send('Collection creada con exito')
        }else{
            return res.status(400).send(result.result)
        }
    }catch (e: any) {
        errorConsoleLog(FILENAME,`/addCollection.error=${e.message}`)
        return res.status(500).send("Error interno")
    }
})



export default router