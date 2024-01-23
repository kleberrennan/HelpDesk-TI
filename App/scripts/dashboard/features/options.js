function initOptions(optsArr, currentOpt, typeOpt) {
    optsArr.forEach((idOpt) => {
        $(`#${idOpt}`).click(function (event) {
            const activeClass = typeOpt === 1 ? ["opt-active", "active-data-opt"] : ["call-type-active", "active-type-call"];

            if (event.target.id) {
                currentOpt = switchOption(event.target.id, currentOpt, activeClass);
            } else {
                currentOpt = switchOption(event.currentTarget.id, currentOpt, activeClass);
            }
        });
    });
}

function getOwnerSocket(response, ownerName) {
    const dataJSON = JSON.parse(JSON.parse(response));
    const idBox = $(conf.popups.OWNER_POPUP).data('boxid');

    if(dataJSON.response.message) {
        var getOwnerOrder = "";

        const requestSocket = {
            'action': 'getOwnerOrder',
            'ownerName': ownerName,
            'ownerTitleId': idBox,
            "targetId": 2,
        }
        if(typeof getOwnerOrder != "WebSocket") {
            getOwnerOrder = initChatSocket(idBox, null, true, requestSocket, true);
            console.log(getOwnerOrder)
        }
        $(conf.popups.OWNER_POPUP).css({display: 'none'});
        $(conf.popups.OVERLAY).css({display: 'none'});
        $(`#ownerOrderTitle_${idBox}`).
            html(`<span>POSSE:</span> ${ownerName}`);
    } else {
        console.error("getOwnerOrder failed to request!");
    }
}

function startFinishBtn(data) {
    const sectorId = $(`#orderChat_${data.boxId}`).data("userorder-id");

        const finishOrder = {
            action: "deleteOrder",
            data: {
                "sectorId": sectorId
            }
        }

        POST(config.server.ACTION_URL, finishOrder).then((response) => {
            const formatJSON = response.replace(/^"|"$/g, '').replace(/\\/g, '');
            const responseJSON = JSON.parse(formatJSON);
            var socketInstance = "";

            if(!responseJSON.response.message) {
                const requestData = {
                    action: "broadcastDeleteOrder",
                    idSector: sectorId,
                    targetId: 2
                }

                if(typeof socketInstance != "WebSocket") {
                    socketInstance = initChatSocket(null, null, true, requestData, false);
                    console.log(socketInstance)
                }
            }
        });
}

function startOwnerBtn(data) {
    $(conf.popups.OVERLAY).css({display: 'flex'});
    $(conf.popups.OWNER_POPUP).css({display: 'flex'});
    $(conf.popups.OWNER_POPUP).data('orderid', $(`#orderChat_${data.boxId}`).data("userorder-id"));
    $(conf.popups.OWNER_POPUP).data('boxid', data.boxId);
    $(conf.popups.OWNER_POPUP).find(".title-owner span")
        .html($(`#ownerBtn_${data.boxId}`).data("username"));
}

function startChatFromSector() {
    $(config.pages.sector.chat.CHAT_TI).click(function() {
        chatTIClick = startChatFeature(conf.chat.TICHAT, chatTIClick, conf.chat.RECEIVER_BOX);
    })

    $(conf.chat.CLOSE_CHAT_SECTOR).click(function() {
        chatTIClick = startChatFeature(conf.chat.TICHAT, chatTIClick, conf.chat.RECEIVER_BOX);
        $("#chatTIMessages .message-recipient, #chatTIMessages .message-recipient-external").remove();
    })

    $(config.pages.sector.chat.CHAT_TI).css({
        cursor: "pointer",
        opacity: "1"
    })
}

function startOrderChat(data) {
    const loadingChat = $("#loadingChat").css({display: 'flex'});
            const receiverBox = $(conf.chat.RECEIVER_BOX);
            const idUserOrder = $(`#orderChat_${data.boxId}`).data("userorder-id");
            const userName = $(`#orderChat_${data.boxId}`).data('username');

            $(receiverBox).data("currentChatOrder", idUserOrder);
            $("#titleChat").html(`CHAT COM ${userName}`)
            POST("../../Server/Handler/Actions.php", {
                action: "getRequestStatusTI",
                data: {
                    targetSector: idUserOrder
                }
            }).then(function(response) {
                const dataJSON = JSON.parse(JSON.parse(response));
                const sectorId = $(`#orderChat_${data.boxId}`).data("userorder-id");

                if(!dataJSON.response.message) { 
                    const dataToSend = {
                        action: "callSector",
                        fromChat: sectorId,
                        isRequested: true
                    }

                    chatOrder = initChatSocket(idUserOrder, receiverBox, false, dataToSend);
                } else {
                    const dataToSend = {
                        action: "registerUser",
                        type: "chat",
                        srcId: config.server.idChat.ID_TI,
                        targetId: idUserOrder
                    }

                    getChatMessages(idUserOrder, receiverBox);
                    chatOrder = initChatSocket(config.server.idChat.ID_TI, receiverBox, true, dataToSend)
                }

                loadingChat.css({display: 'none'});
            })

            currentIdOrder = $(`#orderChat_${data.boxId}`).data("userorder-id");
            chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
}

function switchOption(idContainer, currentOpt, activeClass) {
    const activeOpt = 0;
    const activeContent = 1;

    if (currentOpt === "opt-support-call") {
        generateVerseBible();
    }

    $(`#${currentOpt}`).removeClass(activeClass[activeOpt]);
    $(`#${idContainer}`).addClass(activeClass[activeOpt]);
    $(`#${currentOpt}-content`).removeClass(activeClass[activeContent]);
    $(`#${idContainer}-content`).addClass(activeClass[activeContent]);

    return idContainer;
}

function isOwnerDefined() { 
    POST(config.server.ACTION_URL, {
        action: conf.action.order.isOwnerDefined
    })
 }

function isRequestedCall(btnId, idSector, isSector = false) {
    POST(config.server.ACTION_URL, {
        action: conf.action.order.isRequestedChat,
        data: {
            targetSector: idSector
        }
    }).then(function(response) {
        const dataJSON = JSON.parse(JSON.parse(response));
        var isChatActive = false;

        if(isSector) {
            if(dataJSON.response.message) {
                isChatActive = true;
                $(btnId).css({cursor: 'pointer', opacity: '1'});
                $(btnId).click(function () {
                    getChatMessages(config.pages.constants.ID_TI, $(conf.chat.RECEIVER_BOX));
                    checkClick = startChatFeature(config.pages.sector.chat.TICHAT, !checkClick);
                });
            } else {
                $(btnId).css({cursor: 'not-allowed', opacity: '0.3'});
            }
        }

        return isChatActive;
    })
    
}