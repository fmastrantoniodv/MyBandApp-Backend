import express from 'express'
import projectsRouter from './routes/projects'
import collectionsRouter from './routes/collections'
import users from './routes/users'
import samples from './routes/samples'

const app = express()
app.use(express.json())

const PORT = 3001

app.use('/api/project', projectsRouter)
app.use('/api/collections', collectionsRouter)
app.use('/api/users', users)
app.use('/api/samples', samples)

app.listen(PORT, () =>{
    console.log(`[${new Date().toISOString()}].Server running on port ${PORT}`)
})