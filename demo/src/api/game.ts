import express from 'express'
import { Server } from 'socket.io'
import { ActionType } from '../game/action'
import { Game } from '../game/game'
import playerRouter from './player'
import readinessRouter from './readiness'
import playerTurn from './playerTurn'
import { State } from '../game/state'
import { EndStateManager } from '../game/endGameState'

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

router.get('/state', (req, res) => {
  const game: Game = req.app.get('game')
  res.send({ state: game.stateManager.state })
})

router.get('/winner', (req, res) => {
  const game: Game = req.app.get('game')
  if (game.stateManager.state !== State.END) return res.sendStatus(404)
  const manager = game.stateManager as EndStateManager
  res.send({ winner: game.playerManager.getPlayerByID(manager.winnerID) })
})

router.use('/players', playerRouter)
router.use('/readinesses', readinessRouter)
router.use('/player-turns', playerTurn)

export default router
