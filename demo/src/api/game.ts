import express from 'express'
import { Server } from 'socket.io'
import { ActionType } from '../game/action'
import { Game } from '../game/game'
import playerRouter from './player'
import readinessRouter from './readiness'

const router = express.Router()

enum GameClientTopic {
  GAME_STARTED = 'GAME_STARTED',
}

router.put('/start', (req, res) => {
  const game: Game = req.app.get('game')
  const io: Server = res.app.get('io')

  game.actionManager.sendAction({
    type: ActionType.START_GAME,
    info: null,
  })

  res.sendStatus(200)
  io.emit(GameClientTopic.GAME_STARTED)
})

router.use('/players', playerRouter)
router.use('/readinesses', readinessRouter)

export default router