import express from 'express'
import * as collectionsServ from '../services/collectionsServ'
import envParams from '../envParams.json'
import {parseStringFromRequest, parsePlanType} from '../utils'

const router = express.Router()
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

//#### Get collections
router.get('/', (_req, res) => {
    console.log('request collections')
    const resCollectionsList = collectionsServ.getCollectionsLibrary()
    res.header("Access-Control-Allow-Origin", frontendEndpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(resCollectionsList)
})

//#### Get collection by id
router.get('/:id', (req, res) => {
    console.log('request collection by id:'+req.params.id)
    res.header("Access-Control-Allow-Origin", frontendEndpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    const resCollection = collectionsServ.getCollectionByID(parseStringFromRequest(req.params.id))
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
        res.header("Access-Control-Allow-Origin", frontendEndpoint)
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        const resSample = collectionsServ.getSampleByID(parseStringFromRequest(req.params.collectionId), parseStringFromRequest(req.params.sampleId))
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
        res.header("Access-Control-Allow-Origin", frontendEndpoint)
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
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


/*
router.post('/', (req, res) => {
try{
    const { userId, sampleId, sampleName } = req.body
    parseUserId(userId)
    const newFavEntry: SampleFav = {
        sampleId: parseStringFromRequest(sampleId),
        sampleName: parseStringFromRequest(sampleName)
    }
    const newFav = favouritesSamplesServ.addNewFav(
        userId,
        newFavEntry 
    )
    if(newFav === false){
        throw new Error('No se agregar el nuevo fav porque ya existe')
    }
    res.json(newFav)
}catch (e: any) {
    res.status(400).send(e.message)
}
})

router.delete('/', (req, res) => {
    try{
        const { userId, sampleId } = req.body
        parseUserId(userId)
        parseStringFromRequest(sampleId)
        if(!favouritesSamplesServ.deleteFav(userId, sampleId)){
            throw new Error('No se pudo borrar')
        }
        res.send("ok!")
    }catch (e: any) {
        res.status(400).send(e.message)
    }
})
*/
export default router