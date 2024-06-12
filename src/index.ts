import express from 'express'
import projectsRouter from './routes/projects'
import favouritesRouter from './routes/favourites'
import collectionsRouter from './routes/collections'
import users from './routes/users'
import samples from './routes/samples'

require('./mongo')

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
app.use('/api/users', users)
app.use('/api/samples', samples)

app.listen(PORT, () =>{
    const today = new Date(); // Fecha y hora actual
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    console.log(`Server running on port ${PORT}`)
    console.log('today=', today)
    console.log('normalizedToday=', normalizedToday)
})