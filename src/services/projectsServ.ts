import { Project } from '../interfaces'
import { ProjectInfo } from '../types'
import dataMock from './dataMock.json'

const projects: Array<Project> = dataMock as Array<Project>


export const getProject = (id: string): Project | undefined => {
    const project = projects.find(value => value.projectId === id)
    return project
}

export const getUserProjects = (userId: string): Array<ProjectInfo> => {
    const arrayUserProjects: Array<ProjectInfo> = []
    projects.map(project => {
        if(project.userId === userId){
            arrayUserProjects.push(project)
        }
    })
    return arrayUserProjects
}

export const addProject = (): undefined => undefined