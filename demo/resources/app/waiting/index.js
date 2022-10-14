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
    console.log(msg);
    renderPlayerList(msg)
}

function onGameStart() {
    window.location.href = "/resources/app/standby"
}

function renderPlayerList(players) {
    console.log(players);
    $("#root").html(players.map(({ id, name }) => `<h2>${id} - ${name}</h2>`))
}