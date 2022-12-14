import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import { Game } from './game/game'
import gameRouter from './api/game'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const game = new Game({ maxPlayer: 5 })

app.set('game', game)
app.set('io', io)
app.use('/resources', express.static('resources'))

const router = express.Router()
router.use('/', express.json())
router.use('/game', gameRouter)
app.use('/api', router)

io.on('connection', socket => {
  console.log('a user connected')
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
