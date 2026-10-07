import express from 'express';
import path from 'path';
import router from './routes'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())

app.use(express.json())

app.use(`/uploads`, express.static(path.resolve('uploads')))

app.use(router)

app.listen(PORT, () => (
    console.log(`API ejecutándose en http://localhost:${PORT}`)
))