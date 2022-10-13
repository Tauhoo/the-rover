import express from 'express'
import { Server } from 'socket.io'
import { ActionType, PlayingActionType } from '../game/action'
import { EndStateManager } from '../game/endGameState'
import { Game } from '../game/game'
import { Player, PlayerManager } from '../game/player'
import { PlayingStateManager } from '../game/playingState'
import { ScanPlayingStateManager } from '../game/scanPlayingState'
import { StandbyPlayingStateManager } from '../game/standbyPlayingState'
import { State } from '../game/state'

enum PlayerTurnClientTopic {
  SCAN = 'SCAN',
  GAME_END = 'SCAN',
  MOVE = 'MOVE',
}

const router = express.Router()

router.use('/', (req, res, next) => {
  const game: Game = req.app.get('game')
  if (game.stateManager.state !== State.PLAYING) return res.sendStatus(404)
  next()
})

router.use('/scanner', (req, res, next) => {
  const game: Game = req.app.get('game')
  if ((game.stateManager as PlayingStateManager).state !== State.SCAN_PLAYING)
    return res.sendStatus(404)
  next()
})

router.post('/scanner/scan', (req, res) => {
  const game: Game = req.app.get('game')
  const io: Server = res.app.get('io')

  game.stateManager.doAction({
    type: ActionType.SCAN,
    info: null,
  })
  const state = game.stateManager.state
  if (state === State.END) {
    io.emit(PlayerTurnClientTopic.GAME_END, {})
    res.send({ state: State.END })
  } else if (state === State.STANDBY_PLAYING) {
    const manager = game.stateManager as StandbyPlayingStateManager
    io.emit(PlayerTurnClientTopic.SCAN, {
      playerID: manager.context.getCurrentPlayerGameInfo().player.id,
    })
    res.send({
      state: State.STANDBY_PLAYING,
      result: manager.context.getCurrentPlayerGameInfo().scanRecords,
    })
  } else {
    res.send({
      state: state,
    })
  }
})

router.use('/vehicle', (req, res, next) => {
  const game: Game = req.app.get('game')
  if ((game.stateManager as PlayingStateManager).state !== State.MOVE_PLAYING)
    return res.sendStatus(404)
  next()
})

router.put('/vehicle/move', (req, res) => {
  const game: Game = req.app.get('game')
  const io: Server = res.app.get('io')
  game.stateManager.doAction({
    type: ActionType.MOVE_VEHICLE,
    info: req.body,
  })
  res.send({ state: game.stateManager.state })
  io.emit(PlayerTurnClientTopic.MOVE, {
    playerID: (
      game.stateManager as PlayingStateManager
    ).getCurrentPlayerGameInfo().player.id,
  })
})

router.use('/card', (req, res, next) => {
  const game: Game = req.app.get('game')
  if ((game.stateManager as PlayingStateManager).state !== State.DRAW_PLAYING)
    return res.sendStatus(404)
  next()
})

router.put('/choose-action', (req, res) => {
  const game: Game = req.app.get('game')
  game.stateManager.doAction({
    type: ActionType.CHOOSE_ACTION,
    info: req.body.playingActionType,
  })
  res.send({ state: game.stateManager.state })
})

router.put('/end', (req, res) => {
  const game: Game = req.app.get('game')
  game.stateManager.doAction({
    type: ActionType.END_TURN,
    info: null,
  })
  res.send({ state: game.stateManager.state })
})

export default router
