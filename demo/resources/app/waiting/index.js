jQuery(async function () {
    socket.on('UPDATE_PLAYERS', onUpdatePlayer)
    socket.on('GAME_STARTED', onGameStart)
    const players = (await requester.getPlayerList()).data
    renderPlayerList(players)
    $("#start-button").on("click", startGame)
})

async function startGame() {
    await requester.startGame()
    onGameStart()
}

function onUpdatePlayer(msg) {
    renderPlayerList(msg)
}

function onGameStart() {
    window.location.href = "/resources/app/standby"
}

function renderPlayerList(players) {
    $("#root").html(players.map(({ id, name, color }) => `<h2><div style="height: 30px; width: 30px; background: #${color}; display: inline-block;"></div> ${name}</h2>`))
}