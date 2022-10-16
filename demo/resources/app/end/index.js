jQuery(async function () {
    const winner = (await requester.getWinner()).data.winner
    $("#root").html(`${winner.name} is the winner`)
})