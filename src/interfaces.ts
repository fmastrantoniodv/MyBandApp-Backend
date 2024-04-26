import { SoundListItem } from './types'

export interface Project {
    id: number,
    projectName: string,
    createdDate: string,
    savedDate: string,
    totalDuration: number,
    soundList?: Array<SoundListItem>
}

export interface Favourite {
    id: string,
    displayName: string,
    src: string,
    duration: number
}