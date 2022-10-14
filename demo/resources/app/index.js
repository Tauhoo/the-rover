jQuery(async function () {
    const state = (await requester.getGameState()).data.state
    if (state === "WAITING_PLAYER") {
        renderJoinForm()
        return
    }

    if (state === 'STANDBY') {
        if (typeof localStorage.getItem("playerID") === "string") {
            window.location.href = "/resources/app/waiting"
        } else {
            announce("Game is started")
        }
    } else if (state === 'PLAYING') {
        if (typeof localStorage.getItem("playerID") === "string") {
            window.location.href = "/resources/app/playing"
        } else {
            announce("Game is started")
        }
    } else if (state === 'END') {
        if (typeof localStorage.getItem("playerID") === "string") {
            window.location.href = "/resources/app/end"
        } else {
            announce("Game is end")
        }
    }
})

function announce(text) {
    $("#root").html("<h2>" + text + "</h2>")
}

function renderJoinForm() {
    $("#root").html(`
    <input id="join-name" style="display: block; height: 30px; width: 500px;font-size: 24px;" placeholder="Your name"></input>
    <br/>
    <button id="join-button" style="display: block; font-size: 21px;">Join the game</button>
    `)

    $("#join-button").on("click", async () => {
        const name = $("#join-name").val()
        const id = (await requester.addNewPlayer(name)).data.id
        window.localStorage.setItem("playerID", id)
        window.location.href = "/resources/app/waiting"
    })
}