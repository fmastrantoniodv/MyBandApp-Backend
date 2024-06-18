import express from 'express'
import * as collectionsServ from '../services/collectionsServ'
import * as samplesServ from '../services/samplesServ'
import {parseStringFromRequest, parsePlanType, resHeaderConfig, parseDBObjectId, dbgConsoleLog, getStackFileName} from '../utils'
import { CollectionItemEntry } from '../interfaces'

const router = express.Router()
const FILENAME = getStackFileName()

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
        const { collectionCode, collectionName, plan, sampleList, tags } = req.body
        resHeaderConfig(res)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.REQ=`, req.body)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.getSamplesIdList.pre`)
        const samplesIdList = await samplesServ.getSamplesIdList(sampleList)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.getSamplesIdList.post`)
        const newCollectionEntry: CollectionItemEntry = {
            collectionCode: parseStringFromRequest(collectionCode, 0, 100),
            collectionName: parseStringFromRequest(collectionName, 0, 100),
            uploadDate: new Date(),
            plan: parsePlanType(plan),
            sampleList: samplesIdList.result,
            tags: tags
        }
        dbgConsoleLog(FILENAME, `[POST]/addCollection.createCollection.pre.newCollectionEntry=`, newCollectionEntry)
        const result = await collectionsServ.createCollection(newCollectionEntry)
        dbgConsoleLog(FILENAME, `[POST]/addCollection.createCollection.post.result=${result}`)
        if(result.success){
            res.status(200).send('Collection creada con exito')
        }else{
            res.status(400).send(result.result)
        }
    }catch (e: any) {
        console.error(`[${FILENAME}].[ERROR]./addCollection.error=${e.message}`)
        res.status(500).send("Error interno")
    }
})

export default router