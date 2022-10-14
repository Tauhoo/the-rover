
class Requester {
    api = axios.create({
        baseURL: 'http://localhost:3000/api'
    });

    async getGameState() {
        return await this.api.get("/game/state")
    }

    async startGame() {
        return await this.api.put("/game/start")
    }

    async getPlayerList() {
        return await this.api.get("/game/players/list")
    }

    async addNewPlayer(name) {
        return await this.api.post("/game/players", { name })
    }

    async getReadinessList() {
        return await this.api.get("/game/readinesses/list")
    }

    async ready(playerID) {
        return await this.api.patch("/game/readinesses", { id: playerID })
    }

    async getPlayerGameInfo(playerID) {
        return await this.api.get("/game/player-turns/player-game-infos/" + playerID)
    }

    async getHiddenPlayerGameInfos() {
        return await this.api.get("/game/player-turns/hidden-player-game-infos")
    }

    async getCurrentTurnPlayerID() {
        return await this.api.get("/game/player-turns/current-player-turn")
    }

    async getPlayingState() {
        return await this.api.get('/game/player-turns/playing-state')
    }

    async getTileSetState() {
        return await this.api.get('/game/player-turns/board/tile-set')
    }

    async scan() {
        return await this.api.post("/game/player-turns/scanner/scan")
    }

    async move(path) {
        return await this.api.put('/game/player-turns/vehicle/move', path)
    }

    async chooseAction(playingActionType) {
        return await this.api.put("/game/player-turns/choose-action", { playingActionType })
    }

    async endTurn() {
        return await this.api.put("/game/player-turns/end")
    }
}

var requester = new Requester()