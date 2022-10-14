import express from 'express'
import { Server } from 'socket.io'
import { ActionType } from '../game/action'
import { Game } from '../game/game'
import { Player } from '../game/player'
import { State } from '../game/state'

enum PlayerClientTopic {
  UPDATE_PLAYERS = 'UPDATE_PLAYERS',
}

const router = express.Router()

router.get('/list', (req: express.Request, res: express.Response) => {
  const game: Game = req.app.get('game')
  res.send(game.playerManager.players)
})

router.post('/', (req: express.Request, res: express.Response) => {
  const game: Game = req.app.get('game')

  if (game.stateManager.state !== State.WAITING_PLAYER)
    return res.sendStatus(404)

  const io: Server = res.app.get('io')
  const newPlayer = new Player(req.body.name)

  game.actionManager.sendAction({
    type: ActionType.ADD_PLAYER,
    info: newPlayer,
  })
  res.send(newPlayer)
  io.emit(PlayerClientTopic.UPDATE_PLAYERS, game.playerManager.players)
})

export default router
