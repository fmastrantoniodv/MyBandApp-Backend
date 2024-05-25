import { Project } from '../interfaces'
import { ProjectInfo } from '../types'
import dataMock from './dataMock.json'

const projects: Array<Project> = dataMock as Array<Project>


export const getProject = (id: number): Project | undefined => {
    const project = projects.find(value => value.projectInfo.id === id)
    return project
}

export const getUserProjects = (userId: string): Array<ProjectInfo> => {
    const arrayUserProjects: Array<ProjectInfo> = []
    projects.map(project => {
        if(project.projectInfo.userId === userId){
            arrayUserProjects.push(project.projectInfo)
        }
    })
    return arrayUserProjects
}

export const addProject = (): undefined => undefined