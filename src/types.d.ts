export type EqParams = { low, mid, high }

export interface Project {
    id: number,
    projectName: string,
    createdDate: string,
    savedDate: string,
    totalDuration: number,
}

interface ProjectSoundList extends Project {
    soundList: Array<>
}