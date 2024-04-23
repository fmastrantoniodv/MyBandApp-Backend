import { Project } from '../types.js'
import dataMock from './dataMock.json'

const project: Project = dataMock as Project

export const getProject = (): Project => project

export const addProject = (): undefined => undefined