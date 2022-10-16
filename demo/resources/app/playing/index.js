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
    movingPathSelection: { movePath: [] },
    event: {
        boardMouseMovePosition: {
            cursor: { x: 0, y: 0 },
            tile: { x: 0, y: 0 },
        }
    }
}

jQuery(async function () {
    await initData()
    registerTopic()
    renderPlayersMenu()
    renderPanel()
    frameInit()
    $("#board").on("mousemove", (e) => {
        data.event.boardMouseMovePosition.cursor.x = e.offsetX
        data.event.boardMouseMovePosition.cursor.y = e.offsetY
        const blockWidth = data.board.width / data.board.tileSet[0].length
        const blockHeight = data.board.height / data.board.tileSet.length
        data.event.boardMouseMovePosition.tile.x = Math.floor(e.offsetX / blockWidth)
        data.event.boardMouseMovePosition.tile.y = Math.floor(e.offsetY / blockHeight)
    })
    $("#board").on("click", boardClickHandler)
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

function frameInit() {
    renderBoard()
    requestAnimationFrame(frameInit)
}

function renderBoard() {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = $("#board").get(0)
    const ctx = canvas.getContext('2d')
    const blockWidth = data.board.width / data.board.tileSet[0].length
    const blockHeight = data.board.height / data.board.tileSet.length

    ctx.clearRect(0, 0, data.board.width, data.board.height)
    for (const [i, row] of data.board.tileSet.entries()) {
        for (const [j, colum] of row.entries()) {
            const x = j * blockWidth
            const y = i * blockHeight
            ctx.fillStyle = "gray"
            ctx.fillRect(x + 0.5, y + 0.5, blockWidth - 1, blockHeight - 1)
        }
    }


    // render hover
    switch (data.playingState) {
        case 'DRAW_PLAYING':
            break
        case 'STANDBY_PLAYING':
            break
        case 'SCAN_PLAYING':
            break
        case 'MOVE_PLAYING':
            renderBoardMovingGUI()
            break
    }

    // render player position
    for (const info of data.playerInfos) {
        renderPlayer(info)
    }
}

function renderBoardMovingGUI() {
    const canvas = $("#board").get(0)
    const ctx = canvas.getContext('2d')
    const blockWidth = data.board.width / data.board.tileSet[0].length
    const blockHeight = data.board.height / data.board.tileSet.length
    const fullPointsPath = [data.myPlayerInfo.position, ...data.movingPathSelection.movePath]
    for (let index = 0; index < fullPointsPath.length - 1; index++) {
        const current = fullPointsPath[index];
        const next = fullPointsPath[index + 1]
        blockPathIterator(current, next, (x, y) => {
            ctx.fillStyle = "yellow"
            ctx.fillRect(x * blockWidth + 0.5, y * blockHeight + 0.5, blockWidth - 1, blockHeight - 1)
        })
    }

    blockPathIterator(fullPointsPath[fullPointsPath.length - 1], data.event.boardMouseMovePosition.tile, (x, y) => {
        ctx.fillStyle = "green"
        ctx.fillRect(x * blockWidth + 0.5, y * blockHeight + 0.5, blockWidth - 1, blockHeight - 1)
    })
}

function blockPathIterator(from, to, callback) {
    const xLength = to.x - from.x
    const yLength = to.y - from.y
    const xAbsLength = Math.abs(xLength)
    const yAbsLength = Math.abs(yLength)
    const xDirection = xLength / xAbsLength
    const yDirection = yLength / yAbsLength
    // callback(to.x, to.y)
    if (xAbsLength > yAbsLength) {
        for (let index = 0; index < xAbsLength; index++) {
            callback(from.x + index * xDirection, from.y)
        }
        for (let index = 0; index <= yAbsLength; index++) {
            callback(from.x + xLength, from.y + index * yDirection)
        }
    }
    else {
        for (let index = 0; index < yAbsLength; index++) {
            callback(from.x, from.y + index * yDirection)
        }
        for (let index = 0; index <= xAbsLength; index++) {
            callback(from.x + index * xDirection, from.y + yLength)
        }
    }
}

function renderPlayer(playerInfo) {
    const { x, y } = playerInfo.position
    const blockWidth = data.board.width / data.board.tileSet[0].length
    const blockHeight = data.board.height / data.board.tileSet.length
    const realX = x * blockWidth
    const realY = y * blockHeight

    const canvas = $("#board").get(0)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "blue";
    ctx.fillRect(realX + 0.5, realY + 0.5, blockWidth - 1, blockHeight - 1)
}

function renderPlayersMenu() {
    $("#player-infos-container").html(data.playerInfos.map((info) => `
    <div ${data.currentPlayerID === info.player.id ? `class="active-player"` : ""}>
        <h2>${info.player.name}</h2>
    </div>
    `).join(""))
}

function renderPanel() {
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
            renderMessageToPanel(`${currentPlayerInfo.player.name} is moving the vehicle.`)
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
                await requester.chooseAction('MOVE_VEHICLE')
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
            <button id="start-moving-button">Start moving</button>
            <button id="clear-path-button">Clear path</button>
            `)
            $("#start-moving-button").on("click", async () => {
                const path = getRealMovingPath()
                data.movingPathSelection.movePath = []
                await requester.move(path)
            })
            $("#clear-path-button").on("click", async () => {
                data.movingPathSelection.movePath = []
            })

            break
    }
}

function getRealMovingPath() {
    let realPath = []
    let path = [data.myPlayerInfo.position, ...data.movingPathSelection.movePath]
    for (let index = 0; index < path.length - 1; index++) {
        const current = path[index]
        const next = path[index + 1]
        blockPathIterator(current, next, (x, y) => {
            realPath.push({ x, y })
        })
        realPath.pop()
    }
    // realPath.push(path[path.length - 1])
    return realPath
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
    }
    await updatePlayerInfos()
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

function boardClickHandler() {
    switch (data.playingState) {
        case 'DRAW_PLAYING':
            break
        case 'STANDBY_PLAYING':
            break
        case 'SCAN_PLAYING':
            break
        case 'MOVE_PLAYING':
            const { x, y } = data.event.boardMouseMovePosition.tile
            data.movingPathSelection.movePath.push({ x, y })
            break
    }
}