const CHAT_TI = "#openChatWithSupport";
const INPUT_CHAT_TI = "#inputMessageTI";
const SEND_CHAT_TI = "#sendInputMessageTI";
const SELECT_OPTIONS_CALL_TI = "#buttonCallTI";
const CHAT_ID_POPUP = "#popupErrSupportTI";
const ACTION_URL = "../../Server/Handler/Actions.php";
const DEFAULT_VALUE_SIZE_TEXTAREA = 30;
const SUCCESS_CALL_SECTOR ="successCall";
const CALL_NOT_ATTENDED = "stillCall";

const firstOptSector = "opt-home";
const optSectorArr = [firstOptSector, "opt-citizen-call", "opt-support-call", "opt-about"];
const dashboardOptions = 1;
const callTypeOptions = 2;

const multiplierHeightChat = 20;

const TICHAT = 1;
const SECTORCHAT = 2;
const DEFAULT_VALUE = 0;

const ID_TI = 2;

const idToRegister = $(CHAT_TI).data('id-user');
const userId = $("#openChatWithSupport").data("id-user");
const receiverBox = $("#chatTIMessages");

var currentOpt = firstOptSector;
var shiftPressed = false;
var counterSpace = 1;
var newSize = DEFAULT_VALUE_SIZE_TEXTAREA;
var isOnlyEnter = false;
var checkClick = false;
var isAnimateErr = false;

var webSocket = null;
var openConnection = {};

$(document).ready(function() {
    if(webSocket instanceof WebSocket) {
        webSocket = null;
    }

    currentOpt = initOptions(optSectorArr, currentOpt, dashboardOptions);

    webSocket = isRequestedCall(CHAT_TI, userId, true);

    $(INPUT_CHAT_TI).on("keydown", function (e) {
        const textarea = $("#inputMessageTI");
        const key = e.originalEvent.key;

        const result = handleKeydown
            (
                textarea, 
                key, 
                DEFAULT_VALUE_SIZE_TEXTAREA, 
                multiplierHeightChat, 
                false, 
                idToRegister, 
                ID_TI, 
                webSocket, 
                $("#chatTIMessages"),
                Object.keys(openConnection)[0]);

        shiftPressed = result.shiftPressed;
        counterSpace = result.counterSpace;
        isOnlyEnter = result.isOnlyEnter;
    });

    $(INPUT_CHAT_TI).on("input", function () {
        const textarea = $("#inputMessageTI");

        if (isOnlyEnter) {
            textarea.val("");
            isOnlyEnter = false;
        }
        textarea.text(textarea.val());
    });

    $(SEND_CHAT_TI).click(function () {
        const inputVal = $("#inputMessageTI").val();
        if (inputVal === "") {
            return;
        } else {
            sendToSocketMessage($("#chatTIMessages"), $("#inputMessageTI"), ID_TI, $("#openChatWithSupport").data('id-user'));
            $("#inputMessageTI").val('').val().replace(/(\r\n|\n|\r)/gm, '').trim();
        }
    });

    $(SELECT_OPTIONS_CALL_TI).click(function() {
        const DEFAULT_OPTION = $("#reasonCall option:first");

        const select = $("#reasonCall");
        const optionCall = select.val();
    
        if(optionCall == DEFAULT_OPTION) {
            showMsg(CHAT_ID_POPUP, "Selecione uma razão!");
        } else {
            POST(ACTION_URL, {action: 'checkOrderSector'}).then(function(isOrder) {
                if(!isOrder) {
                    const requestUser = {
                        'name': "insertOrderSector",
                        'param': {
                            'reasonCall': optionCall
                        }
                    }

                    POST(ACTION_URL, { action: requestUser['name'], data: requestUser['param']})
                        .then(function(response) {
                            console.log(response)
                        })
                        
                } else {
                    showMsg(CHAT_ID_POPUP, "Calminha amigão! O seu chamado ainda está em atendimento!", CALL_NOT_ATTENDED);
                }
            }).catch(function(error) {
                console.error(error);
            })
        }
    });

    $("#opt-logout-sector").click(function() {
        $.ajax({
            method: 'POST',
            url: ACTION_URL,
            data: {
                action: "logout"
            },
            success: function(response) {
                window.location.reload();
            }, error: function(err) {
                console.error(err);
            }
        })
    })
})