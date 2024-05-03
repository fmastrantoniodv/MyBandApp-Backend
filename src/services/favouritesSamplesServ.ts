import { SampleFav } from '../types'
import favouritesMock from './favouritesMock.json'

const favouritesList: Array<SampleFav> = favouritesMock.favouritesList as Array<SampleFav>

export const getFavouritesList = (): Array<SampleFav> | undefined => {
    return favouritesList
}

export const addNewFav = (userId: number, favEntry: SampleFav): SampleFav => {
    console.log('fav from userId:',userId)
    console.log('fav:', favEntry)
    favouritesList.push(favEntry)
    return favEntry
}
