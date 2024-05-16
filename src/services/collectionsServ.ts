//import favouritesMock from './favouritesMock.json'
import { CollectionSampleLibrary } from '../interfaces'
import { PlanType, SampleToChannel } from '../types'
import collectionsMock from './collectionSamplesMock.json'

const collectionsLibrary: Array<CollectionSampleLibrary> = collectionsMock.collectionsLibrary as Array<CollectionSampleLibrary>

export const getCollectionsLibrary = (): Array<CollectionSampleLibrary> | undefined => {
    return collectionsLibrary
}

export const getCollectionByID = (id: string): CollectionSampleLibrary | undefined => {
    return collectionsLibrary.find(value => value.collectionId === id)
}

export const getSampleByID = (collectionId: string,sampleId: string): SampleToChannel | undefined => {
    const collection = collectionsLibrary.find(value => value.collectionId === collectionId)
    console.log(collection)
    if(collection === undefined) return collection

    const resSample = collection.sampleList.find(value=> value.sampleId === sampleId)
    console.log(resSample)
    
    return resSample
}

export const getCollectionsByPlan = (plan: PlanType): Array<CollectionSampleLibrary> | undefined => {
    return collectionsLibrary.filter(col => col.plan === plan)
}
/*
export const addNewFav = (userId: number, favEntry: SampleFav): SampleFav | boolean => {
    console.log('fav from userId:',userId)
    console.log('fav:', favEntry)
    var indexFav = favouritesList.findIndex(value => value.sampleId === favEntry.sampleId)
    if(indexFav < 0){
        favouritesList.push(favEntry)    
        return favEntry
    }else{
        return false
    }
}
*/
/*
export const deleteFav = (userId: number, sampleId: string): boolean => {
    console.log('fav from userId:',userId)
    console.log('fav sampleId:', sampleId)
    var indexDeleteFav = favouritesList.findIndex(value => value.sampleId === sampleId)
    if(indexDeleteFav >= 0){
        favouritesList.splice(indexDeleteFav, 1)
        return true
    }else{
        return false
    }
}
*/