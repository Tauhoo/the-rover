var data = {
    playingState: null,
    currentPlayerID: null,
    board: {
        width: 500,
        height: 500,
        tileSet: []
    },
    playerInfos: [],
    myPlayerInfo: null,
    stateInfo: null,
}

jQuery(async function () {
    await initData()
    registerTopic()
    renderBoard()
    renderPlayersMenu()
    renderPanel()
})

function isMyTurn() {
    return data.currentPlayerID === data.myPlayerInfo.player.id
}

async function initData() {
    await updateTileSet()
    await updateCurrentPlayer()
    await updatePlayingState()
    await updatePlayerInfos()
    await updateMyPlayerInfo()
}

async function updateTileSet() {
    const tileSet = (await requester.getTileSet()).data.tileSet
    data.board.tileSet = tileSet
}

async function updateCurrentPlayer() {
    const currentPlayerID = (await requester.getCurrentTurnPlayerID()).data.id
    data.currentPlayerID = currentPlayerID
}

async function updatePlayingState() {
    const state = (await requester.getPlayingState()).data.playingState
    data.playingState = state
}

async function updatePlayerInfos() {
    const infos = (await requester.getHiddenPlayerGameInfos()).data
    data.playerInfos = infos
}

async function updateMyPlayerInfo() {
    const playerID = window.localStorage.getItem("playerID")
    const info = (await requester.getPlayerGameInfo(playerID)).data
    data.myPlayerInfo = info
}

async function renderBoard() {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = $("#board").get(0)
    const ctx = canvas.getContext('2d')

    console.log(data.board.tileSet.entries());
    ctx.clearRect(0, 0, data.board.width, data.board.height)
    for (const [i, row] of data.board.tileSet.entries()) {
        for (const [j, colum] of row.entries()) {
            const blockWidth = data.board.width / row.length
            const blockHeight = data.board.height / data.board.tileSet.length
            const x = j * blockWidth
            const y = i * blockHeight
            ctx.fillRect(x, y, blockWidth, blockHeight)
        }
    }
}

function renderPlayersMenu() {
    console.log(data.playerInfos);
    $("#player-infos-container").html(data.playerInfos.map((info) => `
    <div ${data.currentPlayerID === info.player.id ? `class="active-player"` : ""}>
        <h2>${info.player.name}</h2>
    </div>
    `).join(""))
}

function renderPanel() {
    console.log(data);
    console.log("RENDER PANEL: is_my_turn =", data.currentPlayerID === data.myPlayerInfo.player.id);
    if (data.currentPlayerID === data.myPlayerInfo.player.id) {
        renderMyTurnPanel()
    } else {
        renderAnotherPlayerTurnPanel()
    }
}

function renderAnotherPlayerTurnPanel() {
    const currentPlayerInfos = data.playerInfos.filter(({ player }) => player.id === data.currentPlayerID)
    if (currentPlayerInfos.length !== 1) return
    const currentPlayerInfo = currentPlayerInfos[0]
    switch (data.playingState) {
        case 'DRAW_PLAYING':
            renderMessageToPanel(`${currentPlayerInfo.player.name} is drawing card.`)
            break
        case 'STANDBY_PLAYING':
            renderMessageToPanel(`${currentPlayerInfo.player.name} is selecting action.`)
            break
        case 'SCAN_PLAYING':
            renderMessageToPanel(`${currentPlayerInfo.player.name} is scanning.`)
            break
        case 'MOVE_PLAYING':
            renderMessageToPanel(`${currentPlayerInfo.player.name} is move the vehicle.`)
            break
    }
}

function renderMessageToPanel(text) {
    $("#panel").html(`<h2>${text}</h2>`)
}

function renderNotifyToPanel(text) {
    $("#close-notify-button").off("click")
    $("#panel").html(`<h2>${text}</h2><button id="close-notify-button">close</button>`)
    $("#close-notify-button").on("click", renderPanel)
}

function renderMyTurnPanel() {
    switch (data.playingState) {
        case 'DRAW_PLAYING':
            $("#draw-button").off("click")
            $("#panel").html(`<button id="draw-button"> Click here to draw cards </button>`)
            $("#draw-button").on("click", async () => {
                await requester.drawCard()
            })
            break
        case 'STANDBY_PLAYING':
            $("#panel").html(`
            <h2>Select an action</h2>
            <button id="scan-button">Scan</button>
            <button id="move-button">Move your vehicle</button>
            <button id="end-turn-button">End your turn</button>
            `)
            $("#scan-button").off("click")
            $("#scan-button").on("click", async () => {
                await requester.chooseAction('SCAN')
            })
            $("#move-button").off("click")
            $("#move-button").on("click", async () => {
                await requester.chooseAction('MOVE')
                data.stateInfo = { movePath: [] }
            })
            $("#end-turn-button").off("click")
            $("#end-turn-button").on("click", async () => {
                await requester.chooseAction('END_TURN')
            })
            break
        case 'SCAN_PLAYING':
            $("#panel").html(`<button id="start-scan-button"> Start scaning</button>`)
            $("#start-scan-button").off("click")
            $("#start-scan-button").on("click", async () => {
                await requester.scan()
            })
            break
        case 'MOVE_PLAYING':
            $("#panel").html(`
            <h2>Select your path</h2>
            <button id="start-moving-button"> Start moving</button>
            `)
            $("#start-scan-button").on("click", async () => {
                await requester.move(data.stateInfo.movePath)
            })
            break
    }
}

function registerTopic() {
    socket.on('SCAN', onScan)
    socket.on('GAME_END', onGameEnd)
    socket.on('MOVE', onMove)
    socket.on('CHOOSE_ACTION', onChooseAction)
    socket.on('DRAW', onDraw)
}

async function onScan() {
    console.log("TOPIC ACTIVATE: SCAN");
    if (isMyTurn()) {
        await updateMyPlayerInfo()
    } else {
        await updatePlayerInfos()
    }
    await updatePlayingState()
    const result = data.myPlayerInfo.scanRecords[data.myPlayerInfo.scanRecords.length - 1]
    if (result === 'NEAR') {
        renderNotifyToPanel("Scanner detects Graxium around")
    } else if (result === 'NOT_NEAR') {
        renderNotifyToPanel("Scanner detects nothing")
    } else {
        renderPanel()
    }
}

function onGameEnd() {
    console.log("TOPIC ACTIVATE: END");
}

async function onMove() {
    console.log("TOPIC ACTIVATE: MOVE");
    if (isMyTurn()) {
        await updateMyPlayerInfo()
    } else {
        await updatePlayerInfos()
    }
    await updatePlayingState()
    renderBoard()
    renderPanel()
}

async function onChooseAction(msg) {
    console.log("TOPIC ACTIVATE: CHOOSE_ACTION data =", msg);
    await updatePlayingState()
    await updateCurrentPlayer()
    renderPanel()
    renderPlayersMenu()
}

async function onDraw() {
    console.log("TOPIC ACTIVATE: DRAW");
    if (isMyTurn()) {
        await updateMyPlayerInfo()
    } else {
        await updatePlayerInfos()
    }
    await updatePlayingState()
    renderPanel()
}