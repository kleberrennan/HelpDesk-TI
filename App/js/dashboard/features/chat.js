function formatTextOutput(inputText, isChat = false) {
    let formatText = inputText.replace(/\n/g, isChat ? "" : "<br>");
    return formatText;
}

function startChatFeature(targetChat, checkClick) {
    const NO_CHAT_CONTAINER = 0;
    const CHAT_CONTAINER = 1;

    let toggleContainerIDs = [];

    switch (targetChat) {
        case TICHAT:
            toggleContainerIDs = ['#supportCallTI', '#chatWithTI'];
            break;
        case SECTORCHAT:
            $("#menuSwitchCallType").css({ display: checkClick ? 'none' : 'flex' });
            toggleContainerIDs = ['#receiveCallsTI', '#chatWithSector'];
            break;
    }

    if (checkClick) {
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({ display: 'none' });
        $(toggleContainerIDs[CHAT_CONTAINER]).css({ display: 'flex' });
        if($("body").data("page") == "sector") {
            $("#openChatWithSupport").css({display: 'none'});
        }
    } else {
        $(toggleContainerIDs[CHAT_CONTAINER]).css({ display: 'none' });
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({ display: 'flex', 'flex-direction': 'column' });
        if($("body").data("page") == "sector") {
            $("#openChatWithSupport").css({display: 'flex'});
        }
    }

    return !checkClick;
}

function sendMsgChat(idChat, idInput, socketChat, srcId, targetId, isCurrentUser = true) {
    if (idInput.val().trim() === "") {
        return;
    } else {
        const sendMsg = {
            action: "sendOrderMessage",
            srcId: srcId,
            targetId: targetId,
            message: idInput.val()
        }

        socketChat.send(JSON.stringify(sendMsg));

        insertDataToChatBox(idChat, true, sendMsg['message']);
    }
}

function insertDataToChatBox(idChat, isCurrentUser = true, message) {
    if(isCurrentUser) {
        idChat.append(
            `<div class='message-recipient'>
                <div class='message-recipient-show'>
                    ${formatTextOutput(message)}
                </div>
            </div>`
        );
    } else {
        idChat.append(
            `<div class='message-recipient'>
                <div class='message-recipient-show'>
                    TRIGGERTRIGGER!${formatTextOutput(message)}
                </div>
            </div>`
        );
    }
}