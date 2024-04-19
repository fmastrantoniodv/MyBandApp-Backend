import { Project } from '../types.js'
import dataMock from './dataMock.json'

const project: Array<Project> = dataMock as Array<Project>

export const getProjects = () => project

export const addProject = () => null 