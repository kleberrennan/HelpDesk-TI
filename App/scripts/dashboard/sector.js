const conf = config.pages.sector;

const idToRegister = $(conf.chat.CHAT_TI).data('id-user');
const userId = $(conf.chat.CHAT_TI).data("id-user");
const receiverBox = $(conf.chat.RECEIVER_BOX);

var currentOpt = conf.options.firstOptSector;
var shiftPressed = false;
var counterSpace = 1;
var newSize = config.pages.constants.DEFAULT_VALUE_SIZE_TEXTAREA;
var isOnlyEnter = false;
var checkClick = false;
var isAnimateErr = false;

let chatTIClick = true;

var webSocket = null;
var openConnection = {};

$(document).ready(function() {
    if(webSocket instanceof WebSocket) {
        webSocket = null;
    }
    
    currentOpt = initOptions(conf.options.optSectorArr, currentOpt, config.pages.constants.dashboardOptions);
    
    webSocket = isRequestedCall(conf.chat.CHAT_TI, userId, true);

    if(chatTIClick) {        
        $(conf.chat.CLOSE_CHAT_SECTOR).click(function() {
            chatTIClick = startChatFeature(conf.chat.TICHAT, !chatTIClick, conf.chat.RECEIVER_BOX);
            $("#chatTIMessages .message-recipient, #chatTIMessages .message-recipient-external").remove();
        })
    }

    $(conf.chat.INPUT_CHAT_TI).on("keydown", function (e) {
        const textarea = $(conf.chat.INPUT_CHAT_TI);
        const key = e.originalEvent.key;

        const result = handleKeydown
            (
                textarea, 
                key, 
                config.pages.constants.DEFAULT_VALUE_SIZE_TEXTAREA, 
                config.pages.constants.multiplierHeightChat, 
                false, 
                idToRegister, 
                config.pages.constants.ID_TI, 
                webSocket, 
                $(conf.chat.RECEIVER_BOX),
                Object.keys(openConnection)[0]);

        shiftPressed = result.shiftPressed;
        counterSpace = result.counterSpace;
        isOnlyEnter = result.isOnlyEnter;
    });

    $(conf.chat.INPUT_CHAT_TI).on("input", function () {
        const textarea = $(conf.chat.INPUT_CHAT_TI);

        if (isOnlyEnter) {
            textarea.val("");
            isOnlyEnter = false;
        }
        textarea.text(textarea.val());
    });

    $(conf.chat.SEND_CHAT_TI).click(function () {
        const inputVal = $(conf.INPUT_CHAT_TI).val();
        if (inputVal === "") {
            return;
        } else {
            sendToSocketMessage($(conf.chat.INPUT_CHAT_TI), $(conf.chat.INPUT_CHAT_TI), config.pages.constants.ID_TI, $(conf.chat.CHAT_TI).data('id-user'));
            $(conf.INPUT_CHAT_TI).val('').val().replace(/(\r\n|\n|\r)/gm, '').trim();
        }
    });

    $(conf.requestOrder.SELECT_OPTIONS_CALL_TI).click(function() {
        const DEFAULT_OPTION = $("#reasonCall option:first");

        const select = $("#reasonCall");
        const optionCall = select.val();
    
        if(optionCall == DEFAULT_OPTION) {
            showMsg(conf.popups.CHAT_ID_POPUP, "Selecione uma razão!");
        } else {
            POST(config.server.ACTION_URL, {action: conf.action.order.check}).then(function(response) {
                const isOrder = JSON.parse(JSON.parse(response));

                if(!isOrder.response.message) {
                    const requestUser = {
                        'name': conf.action.order.insert,
                        'param': {
                            'reasonCall': optionCall
                        }
                    }

                    POST(config.server.ACTION_URL, { action: requestUser['name'], data: requestUser['param']})
                        .then(function(response) {
                            console.log(response)
                        })
                        
                } else {
                    showMsg(conf.popups.CHAT_ID_POPUP, "Calminha amigão! O seu chamado ainda está em atendimento!", conf.stateCall.CALL_NOT_ATTENDED);
                }
            }).catch(function(error) {
                console.error(error);
            })
        }
    });

    $(conf.buttons.LOGOUT).click(function() {
        POST(config.server.ACTION_URL, {'action': conf.action.logout}).then(function() {
            window.location.reload();
        })
    })
})