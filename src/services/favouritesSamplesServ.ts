import { SampleFav } from '../types'
import favouritesMock from './favouritesMock.json'

const favouritesList: Array<SampleFav> = favouritesMock.favouritesList as Array<SampleFav>

export const getFavouritesList = (): Array<SampleFav> | undefined => {
    return favouritesList
}

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