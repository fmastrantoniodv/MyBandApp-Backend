import { SoundListItem } from './types'

export interface Project {
    id: number,
    projectName: string,
    createdDate: string,
    savedDate: string,
    totalDuration: number,
    soundList?: Array<SoundListItem>
}