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

generateOrdersBoxes("#receiveCallsTI", ACTION_URL).then(function(orders) {
    const ownerOptions = config.pages.ti.owner.options;
    
    $(conf.buttons.CLOSE_BTN_OWNER).click(function() {
        $(conf.popups.OWNER_POPUP).css({display: 'none'});
        $(conf.popups.OVERLAY).css({display: 'none'});
    })

    receiverOrderBox();

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
            const idBox = $(conf.popups.OWNER_POPUP).data('boxid');
            const requestData = {
                'action': 'setOwnerOrder',
                'data': {
                    'ownerName': ownerName,
                    'ownerTitleId': idBox
                }
            }

            POST(ACTION_URL, requestData).then(function(response) {
                getOwnerSocket(response, ownerName);
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
            startOrderChat({boxId: order});
        })

        $(`#finishCall_${order}`).click(function() {
            startFinishBtn({boxId: order});
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