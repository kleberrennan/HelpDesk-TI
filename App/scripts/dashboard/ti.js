const conf = config.pages.ti;

const TICHAT = 1;
const SECTORCHAT = 2;
const DEFAULT_VALUE = 0;
const ACTION_URL = "../../Server/Handler/Actions.php";

const firstOptTI = "opt-home-ti";
const firstOptCallType = "callTypeTI";

const optTIArr = [firstOptTI, "opt-ti-receiver", "opt-report-generate", "opt-feedback"];
const optCallTypeArr = [firstOptCallType, "callTypeCitizen"];

const dashboardOptions = 1;
const callTypeOptions = 2;

const DEFAULT_VALUE_SIZE_TEXTAREA = 30;
const multiplierHeightChat = 20;

let currentOptDashboard = firstOptTI;
let currentOptTypeCall = firstOptCallType;

var currentIdOrder = 0;

currentOptDashboard = initOptions(optTIArr, currentOptDashboard, dashboardOptions);
currentOptTypeCall = initOptions(optCallTypeArr, currentOptTypeCall, callTypeOptions);

let chatWithSectorClick = true;

var chatOrder = "";

generateOrdersBoxes("#receiveCallsTI", ACTION_URL).then(function(orders) {
    const ownerOptions = ["Kleber", "Diorlan", "Italo"];
    
    $(conf.buttons.CLOSE_BTN_OWNER).click(function() {
        $(conf.popups.OWNER_POPUP).css({display: 'none'});
        $(conf.popups.OVERLAY).css({display: 'none'});
    })

    orders.forEach((ownerTitleId) => { 
        const requestSocket = {
            'action': 'registerUser',
            'type': 'order',
            'srcId': config.server.idChat.ID_TI,
            'ownerId': ownerTitleId
        }

        chatOrder = initChatSocket(ownerTitleId, null, true, requestSocket, true);
    })

    ownerOptions.forEach((owner, index) => {
        $(conf.popups.OWNER_POPUP)
            .find('.owner-options')
                .append(
                    `<div>
                        <p id="ownerOpt_${index}">${owner}</p>
                    </div>`
                );

        $(`#ownerOpt_${index}`).click(function(e) {
            const ownerName = e.currentTarget.innerText;
            const orderId = $(`#ownerPopUp`).data("orderid");
            const requestData = {
                'action': 'setOwnerOrder',
                'data': {
                    'ownerName': ownerName,
                    'orderId': orderId
                }
            }

            POST(ACTION_URL, requestData).then(function(response) {
                const dataJSON = JSON.parse(JSON.parse(response));
                const idBox = $(conf.popups.OWNER_POPUP).data('boxid');

                /*const requestSocket = {
                    'action': 'getOwnerOrder',
                    'ownerName': ownerName,
                    'ownerTitleId': idBox,
                    'userId': $(conf.popups.OWNER_POPUP).data('orderid')
                }*/
                
                //chatOrder = initChatSocket(idBox, null, true, requestSocket, true);

                if(dataJSON.response.message) {
                    console.dir(idBox)
                    $(`#ownerOrderTitle_${idBox}`).
                        html(`<span>POSSE:</span> ${ownerName}`);
                    
                    $(conf.popups.OWNER_POPUP).css({display: 'none'});
                    $(conf.popups.OVERLAY).css({display: 'none'});
                }
            });
        })
    })

    Object.values(orders).forEach((order) => {
        $(`#ownerBtn_${order}`).click(function() {
            $(conf.popups.OVERLAY).css({display: 'flex'});
            $(conf.popups.OWNER_POPUP).css({display: 'flex'});
            $(conf.popups.OWNER_POPUP).data('orderid', $(`#orderChat_${order}`).data("userorder-id"));
            $(conf.popups.OWNER_POPUP).data('boxid', order);
            $(conf.popups.OWNER_POPUP).find(".title-owner span")
                .html($(`#ownerBtn_${order}`).data("username"));
        });

        $(`#orderChat_${order}`).click(function() {
            const loadingChat = $("#loadingChat").css({display: 'flex'});
            const receiverBox = $(conf.chat.RECEIVER_BOX);
            const idUserOrder = $(`#orderChat_${order}`).data("userorder-id");
            const userName = $(`#orderChat_${order}`).data('username');

            $(receiverBox).data("currentChatOrder", idUserOrder);
            $("#titleChat").html(`CHAT COM ${userName}`)
            POST("../../Server/Handler/Actions.php", {
                action: "getRequestStatusTI",
                data: {
                    targetSector: idUserOrder
                }
            }).then(function(response) {
                const dataJSON = JSON.parse(JSON.parse(response));

                if(dataJSON.response.message == false ) { 
                    const dataToSend = {
                        action: "callSector",
                        targetSector: idUserOrder,
                        isRequested: true
                    }

                    chatOrder = initChatSocket(config.server.idChat.ID_TI, receiverBox, true, dataToSend);
                } else {
                    loadingChat.css({display: 'none'});
                    getChatMessages(idUserOrder, receiverBox);
                    chatOrder = initChatSocket(config.server.idChat.ID_TI, receiverBox, true)
                }
            })

            currentIdOrder = $(`#orderChat_${order}`).data("userorder-id");
            chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
        })
    
        $(`#finishCall_${order}`).click(function() {
            const finishOrder = {
                action: "deleteOrder",
                data: {
                    idOrder: order
                }
            }
        })
    })
});

var shiftPressed = false;
var counterSpace = 1;
var newSize = DEFAULT_VALUE_SIZE_TEXTAREA;
var isOnlyEnter = false;
var checkClick = false;

$(conf.chat.MESSAGE_INPUT).on("keydown", function (e) {
    const textarea = $(conf.chat.MESSAGE_INPUT);
    const key = e.originalEvent.key;

    const result = handleKeydown
    (
        textarea, 
        key, 
        config.pages.constants.DEFAULT_VALUE_SIZE_TEXTAREA, 
        config.pages.constants.multiplierHeightChat, 
        true, 
        config.server.idChat.ID_TI, 
        currentIdOrder, 
        chatOrder,
        $(conf.chat.RECEIVER_BOX),
        config.server.idChat.ID_TI
        );

    shiftPressed = result.shiftPressed;
    counterSpace = result.counterSpace;
    isOnlyEnter = result.isOnlyEnter;
});

$(conf.chat.MESSAGE_INPUT).on("input", function () {
    const textarea = $(conf.chat.MESSAGE_INPUT);

    if (isOnlyEnter) {
        textarea.val("");
        isOnlyEnter = false;
    }
    textarea.text(textarea.val());
});

$(conf.chat.MESSAGE_INPUT).click(function () {
    const inputVal = $(conf.chat.MESSAGE_INPUT).val();
    if (inputVal === "") {
        return;
    } else {
        sendToSocketMessage($(conf.chat.RECEIVER_BOX), chatOrder, config.server.idChat.ID_TI, currentIdOrder);
        $(conf.chat.MESSAGE_INPUT).val('').val().replace(/(\r\n|\n|\r)/gm, '').trim();
    }
});

if (chatWithSectorClick) {
    $(conf.chat.CLOSE_CHAT_TI).click(function () {
        chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
        $(conf.chat.RECEIVER_BOX).find('.message-recipient', '.message-recipient-external').remove();
    });

    $(conf.chat.SEND_CHAT_SECTOR).click(function () {
        insertDataToChatBox($(conf.chat.RECEIVER_BOX), $(conf.chat.MESSAGE_INPUT).val(), true);
        sendToSocketMessage($(conf.chat.MESSAGE_INPUT), chatOrder, config.server.idChat.ID_TI, currentIdOrder);
    });
}


$(conf.buttons.LOGOUT).click(function() {
    POST(config.server.ACTION_URL, {'action': 'logout'}).then(function() {
        window.location.reload();
    })
})