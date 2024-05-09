import express from 'express'

import projectsRouter from './routes/projects'
import favouritesRouter from './routes/favourites'
import collectionsRouter from './routes/collections'

const app = express()
app.use(express.json())

const PORT = 3001

app.get('/ping', (_req, res) =>{
    console.log('pinged')
    res.send('pong')
})

app.use('/api/project', projectsRouter)
app.use('/api/fav', favouritesRouter)
app.use('/api/collections', collectionsRouter)

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})