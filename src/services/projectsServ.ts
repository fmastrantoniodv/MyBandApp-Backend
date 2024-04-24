import { Project } from '../interfaces'
import dataMock from './dataMock.json'

const projects: Array<Project> = dataMock as Array<Project>


export const getProject = (id: number): Project | undefined => {
    const project = projects.find(value => value.id === id)
    return project
}

export const addProject = (): undefined => undefined