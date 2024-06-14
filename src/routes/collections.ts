import express from 'express'
import * as collectionsServ from '../services/collectionsServ'
import {parseStringFromRequest, parsePlanType, resHeaderConfig, parseDBObjectId} from '../utils'
import { CollectionItemEntry } from '../interfaces'

const router = express.Router()

//#### Get collections
router.get('/', (_req, res) => {
    console.log('request collections')
    const resCollectionsList = collectionsServ.getCollectionsLibrary()
    resHeaderConfig(res)
    res.send(resCollectionsList)
})

//#### Get collection by id
router.get('/:id', (req, res) => {
    console.log('request collection by id:'+req.params.id)
    resHeaderConfig(res)
    const resCollection = collectionsServ.getCollectionByID(parseDBObjectId(req.params.id))
    if(resCollection === undefined){
        res.send("No se encontraron collections con el id declarado")
    }else{
        res.send(resCollection)
    }
    
})

//#### Get sample by id
router.get('/:collectionId/sample/:sampleId', (req, res) => {
    try {
        console.log('request collection by id:'+req.params.collectionId+" sampleid:"+req.params.sampleId)
        resHeaderConfig(res)
        const resSample = collectionsServ.getSampleByID(parseDBObjectId(req.params.collectionId), parseDBObjectId(req.params.sampleId))
        if(resSample === undefined){
            res.send("No se encontró ningun sample con ese ID")
        }else{
            res.send(resSample)
        }
    } catch (e: any) {
        res.status(400).send(e.message)
    }
    
})

//#### Get collections by plan
router.get('/plan/:plan', (req, res) => {
    try{
        console.log('request collections by plan:'+req.params.plan)
        resHeaderConfig(res)
        const resCollection = collectionsServ.getCollectionsByPlan(parsePlanType(req.params.plan))
        if(resCollection === undefined){
            res.send("No se encontraron collections con el plan declarado")
        }else{
            res.send(resCollection)
        }
    }catch (e: any) {
        res.status(400).send(e.message)
    }
})

router.post('/addCollection', async (req, res) => {
    try{
        const { collectionCode, collectionName, plan, sampleList, tags } = req.body
        resHeaderConfig(res)
        const samplesIdList = await collectionsServ.getSamplesIdList(sampleList)
        const newCollectionEntry: CollectionItemEntry = {
            collectionCode: parseStringFromRequest(collectionCode, 0, 100),
            collectionName: parseStringFromRequest(collectionName, 0, 100),
            uploadDate: new Date(),
            plan: parsePlanType(plan),
            sampleList: samplesIdList,
            tags: tags
        }
        const success = await collectionsServ.createCollection(newCollectionEntry)
        console.log('success=', success)
        if(success){
            res.send('Collection creada con exito')
        }else{
            res.status(400).send('La collection no se creo correctamente')
        }
    }catch (e: any) {
        res.status(400).send(e.message)
    }
})

export default router