export type EqParams = {
    low: number,
    mid: number,
    high: number
}

export type States = {
    solo: boolean,
    muted: boolean
}

export type ChannelConfig = {
        states: States,
        volume: number,
        EQ: EqParams
}

export interface Project {
    id: number,
    projectName: string,
    createdDate: string,
    savedDate: string,
    totalDuration: number,
    soundList?: Array<soundListItem>
}

export type soundListItem =         
{
    id: string,
    sampleName: string,
    src: string,
    duration: number,
    channelConfig: ChannelConfig
}
