import { SampleFav } from '../types'
import { Favourite } from '../interfaces'
import favouritesMockup from './favouritesMock.json'

const globalFavouritesList: Array<Favourite> = favouritesMockup.favourites as Array<Favourite>

export const getFavouritesList = (): Object | undefined => {
    return globalFavouritesList
}

export const addNewFav = (userId: string, favEntry: SampleFav): SampleFav | boolean => {
    console.log('fav from userId:',userId)
    console.log('fav:', favEntry)
    var userFavs = globalFavouritesList.find(value => value.userId === userId)
    if(userFavs === undefined){
        globalFavouritesList.push({
            userId: userId,
            favouritesList: [favEntry]
        })
    }else{
        if(userFavs.favouritesList.findIndex(fav => fav.sampleId === favEntry.sampleId) >= 0){
            return false
        }else{
            userFavs.favouritesList.push(favEntry)
        }
    }
    return favEntry
}

export const getUserFavs = (userId: string): Array<SampleFav> => {
    console.log('get favs for userId: '+userId)
    var arrayUserFavs: Array<SampleFav> = []
    globalFavouritesList.map(fav => {
        if(fav.userId === userId){
            arrayUserFavs = fav.favouritesList
        }   
    })
    return arrayUserFavs
}

export const deleteFav = (userId: string, sampleId: string): boolean => {
    console.log('fav from userId:',userId)
    console.log('fav sampleId:', sampleId)
    var indexDeleteFav = globalFavouritesList.findIndex(value => value.userId === userId)
    if(indexDeleteFav >= 0){
        globalFavouritesList.splice(indexDeleteFav, 1)
        return true
    }else{
        return false
    }
}