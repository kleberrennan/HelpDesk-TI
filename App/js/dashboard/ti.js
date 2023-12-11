const TICHAT = 1;
const SECTORCHAT = 2;
const DEFAULT_VALUE = 0;
const ACTION_URL = "../../Server/Handler/Actions.php";

const ID_TI = 2;

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
    
    $("#closeBtn").click(function() {
        $("#ownerPopUp").css({display: 'none'});
        $("#popUpOverlay").css({display: 'none'});
    })

    ownerOptions.forEach((owner, index) => {
        $("#ownerPopUp .owner-options").append(
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
                const idBox = $("#ownerPopUp").data('boxid');
                const requestSocket = {
                    'action': 'getOwnerOrder',
                    'ownerName': ownerName,
                    'userId': $("#ownerPopUp").data('orderid')
                }
                
                chatOrder = initChatSocket(ID_TI, null, true, requestSocket, true);

                if(dataJSON.response.message) {
                    $(`#ownerOrderTitle_${idBox}`).
                        html(`<span>POSSE:</span> ${ownerName}`);
                    
                    $("#ownerPopUp").css({display: 'none'});
                    $("#popUpOverlay").css({display: 'none'});
                }
            });
        })
    })

    Object.values(orders).forEach((order) => {
        $(`#ownerBtn_${order}`).click(function() {
            $("#popUpOverlay").css({display: 'flex'});
            $("#ownerPopUp").css({display: 'flex'});
            $("#ownerPopUp").data('orderid', $(`#orderChat_${order}`).data("userorder-id"));
            $("#ownerPopUp").data('boxid', order);
            $("#ownerPopUp .title-owner span")
                .html($(`#ownerBtn_${order}`).data("username"));
        });

        $(`#orderChat_${order}`).click(function() {
            const loadingChat = $("#loadingChat").css({display: 'flex'});
            const receiverBox = $("#chatSECTORMessages");
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

                    chatOrder = initChatSocket(ID_TI, receiverBox, true, dataToSend);
                } else {
                    loadingChat.css({display: 'none'});
                    getChatMessages(idUserOrder, receiverBox);
                    chatOrder = initChatSocket(ID_TI, receiverBox, true)
                }
            })

            currentIdOrder = $(`#orderChat_${order}`).data("userorder-id");
            chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
        })
    })
});

var shiftPressed = false;
var counterSpace = 1;
var newSize = DEFAULT_VALUE_SIZE_TEXTAREA;
var isOnlyEnter = false;
var checkClick = false;

$("#messageChatInput").on("keydown", function (e) {
    const textarea = $("#messageChatInput");
    const key = e.originalEvent.key;

    const result = handleKeydown
    (
        textarea, 
        key, 
        DEFAULT_VALUE_SIZE_TEXTAREA, 
        multiplierHeightChat, 
        true, 
        ID_TI, 
        currentIdOrder, 
        chatOrder,
        $("#chatSECTORMessages"),
        ID_TI
        );

    shiftPressed = result.shiftPressed;
    counterSpace = result.counterSpace;
    isOnlyEnter = result.isOnlyEnter;
});

$("#messageChatInput").on("input", function () {
    const textarea = $("#messageChatInput");

    if (isOnlyEnter) {
        textarea.val("");
        isOnlyEnter = false;
    }
    textarea.text(textarea.val());
});

$("#messageChatInput").click(function () {
    const inputVal = $("#messageChatInput").val();
    if (inputVal === "") {
        return;
    } else {
        sendToSocketMessage($("#chatTIMessages"), chatOrder, ID_TI, currentIdOrder);
        $("#messageChatInput").val('').val().replace(/(\r\n|\n|\r)/gm, '').trim();
    }
});

if (chatWithSectorClick) {
    $("#closeChatSector").click(function () {
        chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
        $("#chatSECTORMessages .message-recipient, #chatSECTORMessages .message-recipient-external").remove();
    });

    $("#sendInputMessageSECTOR").click(function () {
        const inputVal = $("#messageChatInput").val();

        sendToSocketMessage($("#chatSECTORMessages"), $("#messageChatInput"), chatOrder, ID_TI, currentIdOrder);
    });
}


$("#opt-logout-ti").click(function() {
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