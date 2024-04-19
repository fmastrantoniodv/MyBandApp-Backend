import express from 'express'

const router = express.Router()

router.get('/', (_req, res) => {
    res.send('Fetching all projects')
})

router.post('/', (_req, res) => {
    res.send('Saving a project')
})

export default router