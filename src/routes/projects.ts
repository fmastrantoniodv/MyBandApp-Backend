import express from 'express'
import * as project from '../services/projectsServ'

const router = express.Router()

router.get('/', (_req, res) => {
    console.log(project.getProject())
    res.send(project.getProject())
})

router.post('/', (_req, res) => {
    res.send('Saving a project')
})

export default router