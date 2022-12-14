import express from 'express'
import { Server } from 'socket.io'
import Victor from 'victor'
import { ActionType } from '../game/action'
import { Game } from '../game/game'
import { State } from '../game/state'
import { StandbyStateManager } from '../game/standbyState'
import { NewDefaultPlayerGameInfo } from '../game/playerGameInfo'
import { Player } from '../game/player'

enum ReadinessesClientTopic {
  UPDATE_READINESSES = 'UPDATE_READINESSES',
  ALL_PLAYER_IS_READY = 'ALL_PLAYER_IS_READY',
}

const router = express.Router()

router.use('/', (req, res, next) => {
  const game: Game = req.app.get('game')
  if (game.stateManager.state !== State.STANDBY) return res.sendStatus(404)
  next()
})

router.get('/list', (req, res) => {
  const game: Game = req.app.get('game')
  const standbyStateManager = game.stateManager as StandbyStateManager
  const playerStandbyStatus = Object.fromEntries(
    standbyStateManager.playerStandbyStatus.entries()
  )
  res.send(playerStandbyStatus)
})

router.patch('/', (req, res) => {
  const playerID: string = req.body.id

  const game: Game = req.app.get('game')
  const io: Server = res.app.get('io')
  const standbyStateManager = game.stateManager as StandbyStateManager
  const height = 30
  const width = 30
  game.actionManager.sendAction({
    type: ActionType.PLAYER_IS_READY,
    info: {
      id: playerID,
      boardGameOptions: { height, width },
      playerGameInfos: game.playerManager.players.map(player =>
        NewDefaultPlayerGameInfo(
          player as Player,
          new Victor(
            Math.floor(Math.random() * width),
            Math.floor(Math.random() * height)
          )
        )
      ),
    },
  })
  const playerStandbyStatus = Object.fromEntries(
    standbyStateManager.playerStandbyStatus.entries()
  )

  res.send(playerStandbyStatus)

  if (standbyStateManager.isAllPlayerReady()) {
    io.emit(ReadinessesClientTopic.ALL_PLAYER_IS_READY, playerStandbyStatus)
  } else {
    io.emit(ReadinessesClientTopic.UPDATE_READINESSES, playerStandbyStatus)
  }
})

export default router
