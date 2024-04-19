import express from 'express'

import projectsRouter from './routes/projects'

const app = express()
app.use(express.json())

const PORT = 3001

app.get('/ping', (_req, res) =>{
    console.log('pinged')
    res.send('pong')
})

app.use('/api/projects', projectsRouter)

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})