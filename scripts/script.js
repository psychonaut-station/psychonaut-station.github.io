//https://github.com/alibuyuktatli

let ajaxLoading = false;

const GAME_STATE_STARTUP = 0
const GAME_STATE_PREGAME = 1
const GAME_STATE_SETTING_UP = 2
const GAME_STATE_PLAYING = 3
const GAME_STATE_FINISHED = 4

const getGameState = (state) => {
    switch (state) {
        case GAME_STATE_STARTUP:
            return "Yükleniyor";
        case GAME_STATE_PREGAME:
            return "Lobi";
        case GAME_STATE_SETTING_UP:
            return "Başlıyor";
        case GAME_STATE_PLAYING:
            return "Devam ediyor";
        case GAME_STATE_FINISHED:
            return "Bitti";
        default:
            return "";
    }
}

$(document).ready(function () {
    refresh()
    setInterval(refresh, 5000);

    $("#discord").on("click", function () {
        window.open("https://discord.gg/ErFmSgzMkt")
    })
});

const serverTemplate = (active, name, map, userCount, roundId, roundTime, roundState, ip) => {
    return `<div class="server-panel">
    <div class="server-info">
        <div class="server-info__contents">
            <div class="status">
                <div class="${active == 1 ? "busy" : "offline"}">${active == 1 ? "Aktif" : "Kapalı"}</div>
            </div>
            <div class="server-info__name">${name}</div>
            ${active == 1 ? `
            ${map ? `<div class="server-info-backend">
            <div class="label">Map:</div>
            <div class="host-name">${map}</div>
        </div>` : ""}
            <div class="server-info-backend">
                <div class="label">Oyuncu Sayısı:</div>
                <div class="list-name">${userCount}</div>
            </div>
            <div class="server-info-backend">
                <div class="label">Tur ID:</div>
                <div class="list-name">${roundId}</div>
            </div>
            <div class="server-info-backend">
            <div class="label">Tur durumu:</div>
            <div class="list-name">${getGameState(roundState)}</div>
        </div>
            <div class="server-info-backend">
                <div class="label">Round süresi:</div>
                <div class="list-name">${new Date(roundTime * 1000).toISOString().substring(11, 19)}</div>
            </div>
            <div class="server-info__filtertags">
                <a href="byond://${ip}" class="filtertag">Bağlan</a>
            </div>
            `: ""}
        </div>
    </div>
</div>`
}

const refresh = () => {
    if (ajaxLoading)
        return;

    ajaxLoading = true
    $.ajax({
        type: 'GET',
        url: 'https://api.turkb.us/v2/server',
        dataType: 'json',
        success: function (data) {
            $(".server-list__container").empty()
            if (data.length === 0) {
                $(".server-list__container").append(`<p class="text-center lead">Aktif bir sunucu bulunamadı.</p>`)
            } else {
                data.forEach(server => {
                    $(".server-list__container").append(serverTemplate(server.server_status, server.name, server.map, server.players, server.round_id, server.round_duration, server.gamestate, server.connection_info))
                });
            }
            $("#alert-box").slideUp()
            ajaxLoading = false
        },
        error: function (jqXHR, status, error) {
            $("#alert-box").slideDown().text("API sunucusuna bağlanılamıyor.")
            ajaxLoading = false
        }
    });
}
