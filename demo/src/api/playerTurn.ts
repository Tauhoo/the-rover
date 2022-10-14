import express from 'express'
import Victor from 'victor'
import { Server } from 'socket.io'
import { ActionType } from '../game/action'
import { Game } from '../game/game'
import { Player } from '../game/player'
import { PlayingStateManager } from '../game/playingState'
import { ScanResult } from '../game/scanPlayingState'
import { State } from '../game/state'
import { Vehicle } from '../game/vehicle'

enum PlayerTurnClientTopic {
  SCAN = 'SCAN',
  GAME_END = 'SCAN',
  MOVE = 'MOVE',
  TURN_END = 'TURN_END',
}

const router = express.Router()

router.use('/', (req, res, next) => {
  const game: Game = req.app.get('game')
  if (game.stateManager.state !== State.PLAYING) return res.sendStatus(404)
  next()
})

router.get('/playing-state', (req, res) => {
  const game: Game = req.app.get('game')
  const manager = game.stateManager as PlayingStateManager
  res.send({ playingState: manager.subPlayingStateManager.state })
})

router.get('/board/tile-set', (req, res) => {
  const game: Game = req.app.get('game')
  const manager = game.stateManager as PlayingStateManager
  res.send({ tileSet: manager.board.tileSet })
})

router.get('/current-player-turn', (req, res) => {
  const game: Game = req.app.get('game')
  const manager = game.stateManager as PlayingStateManager
  res.send({ id: manager.getCurrentPlayerGameInfo().player.id })
})

router.get('/player-game-infos/:id', (req, res) => {
  const id = req.query.id as string
  const game: Game = req.app.get('game')
  const manager = game.stateManager as PlayingStateManager
  let playerInfo = manager.getPlayerInfoByID(id)
  if (playerInfo === null) {
    res.sendStatus(404)
  } else {
    res.send(playerInfo)
  }
})

type HiddenPlayerGameInfo = {
  player: Player
  vehicle: Vehicle
  cardsAmount: number
  position: Victor
  scanRecords: HiddenScanRecord[]
}

type HiddenScanRecord = {
  position: Victor
}

router.get('/hidden-player-game-infos', (req, res) => {
  const game: Game = req.app.get('game')
  const manager = game.stateManager as PlayingStateManager
  const playerInfos: HiddenPlayerGameInfo[] = manager.playerGameInfos.map(
    value => ({
      player: value.player,
      vehicle: value.vehicle,
      cardsAmount: value.cards.length,
      position: value.position,
      scanRecords: value.scanRecords.map(record => ({
        position: record.position,
      })),
    })
  )

  res.send(playerInfos)
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

  const manager = game.stateManager as PlayingStateManager
  const scanRecord = manager.getCurrentPlayerGameInfo().scanRecords
  const result = scanRecord[scanRecord.length - 1].result

  if (result === ScanResult.FOUND) {
    io.emit(PlayerTurnClientTopic.GAME_END, {
      winnerID: manager.getCurrentPlayerGameInfo().player.id,
    })
  } else {
    io.emit(PlayerTurnClientTopic.SCAN, {
      playerID: manager.getCurrentPlayerGameInfo().player.id,
    })
  }

  res.send({ result })
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
  res.send({ action: req.body.playingActionType })
})

router.put('/end', (req, res) => {
  const game: Game = req.app.get('game')
  const io: Server = res.app.get('io')
  game.stateManager.doAction({
    type: ActionType.END_TURN,
    info: null,
  })
  const manager = game.stateManager as PlayingStateManager
  let nextPlayerID = manager.getCurrentPlayerGameInfo().player.id
  io.emit(PlayerTurnClientTopic.TURN_END, { nextPlayerID })
  res.send({ nextPlayerID })
})

export default router
