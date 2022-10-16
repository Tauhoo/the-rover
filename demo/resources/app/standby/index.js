jQuery(async function () {
    socket.on('UPDATE_READINESSES', onUpdateReadiness)
    socket.on('ALL_PLAYER_IS_READY', onAllPlayerIsReady)
    onUpdateReadiness()
})

async function onUpdateReadiness() {
    const playerID = window.localStorage.getItem("playerID")
    const players = (await requester.getPlayerList()).data
    const readiness = (await requester.getReadinessList()).data
    const readinessInfoList = players.map(value => ({ id: value.id, name: value.name, isReady: readiness[value.id] }))
    renderReadinessList(readinessInfoList)
    renderReadyButton(readiness[playerID])
}

function onAllPlayerIsReady() {
    window.location.href = "/resources/app/playing"
}

function renderReadinessList(readinessInfoList) {
    let html = readinessInfoList.map(({ id, name, isReady }) => `<h2>${name} - ${isReady ? "Ready" : "Not Ready"}</h2>`)
    $("#root").html(html)
}

function renderReadyButton(isReady) {
    if (isReady) {
        $("#root-button").off("click")
        $("#root-button").html("<h1>Your are ready</h1>")
    } else {
        $("#root-button").html(`<button id="ready-button">Ready</button>`)
        $("#root-button").on("click", async () => {
            const playerID = window.localStorage.getItem("playerID")
            console.log((await requester.ready(playerID)).body);
        })
    }
}