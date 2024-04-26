import { Favourite } from '../interfaces'
import favouritesMock from './favouritesMock.json'

const favouritesList: Array<Favourite> = favouritesMock.favouritesList as Array<Favourite>

export const getFavouritesList = (): Array<Favourite> | undefined => {
    
    return favouritesList
}
