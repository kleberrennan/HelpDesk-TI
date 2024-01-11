function formatTextOutput(inputText, isChat = false) {
    let formatText = inputText.replace(/\n/g, isChat ? "" : "<br>");
    return formatText;
}

function getChatMessages(targetId, receiverBox) {
    //Token user is already a source id!
    const requestUser = {
        action: "getChatMessages",
        data: {
            targetId: targetId
        }
    }

    POST(config.server.ACTION_URL, requestUser)
        .then(function(response) {
            const data = JSON.parse(JSON.parse(response));

            console.dir(data)

            var message = data.response.message;
            
            if(!message) {
                return;
            } else {
                message.replace(/\\n/g, '\n');

                if(message.slice(-5) == "#%SEP") {
                    message = message.slice(0, -5);
                }

                let showMessage = message.split(/#%SEP(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(part => part.trim());

                showMessage.forEach((msg) => {
                    var srcId = parseInt(msg.slice(0, 1));
                    var formatText = msg.slice(2);

                    if(srcId != targetId) {
                        insertDataToChatBox(receiverBox, formatText, true);
                    } else {
                        insertDataToChatBox(receiverBox, formatText, false);
                    }
                })
            }
        })
}

function startChatFeature(targetChat, checkClick) {
    const NO_CHAT_CONTAINER = 0;
    const CHAT_CONTAINER = 1;

    let toggleContainerIDs = [];
    
    switch (targetChat) {
        case conf.chat.TICHAT:
            toggleContainerIDs = ['#supportCallTI', '#chatWithTI', '#chatTIMessages'];
            break;
        case conf.chat.SECTORCHAT:
            $("#menuSwitchCallType").css({ display: checkClick ? 'none' : 'flex' });
            toggleContainerIDs = ['#receiveCallsTI', '#chatWithSector'];
            break;
    }

    if (checkClick) {
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({ display: 'none' });
        $(toggleContainerIDs[CHAT_CONTAINER]).css({ display: 'flex' });
        if($("body").data("page") == "sector") {
            getChatMessages(config.pages.constants.ID_TI, $(toggleContainerIDs[conf.chat.RECEIVER_BOX]));
            $('#panelRightTI').css({display: 'none'});
        }
    } else {
        $(toggleContainerIDs[CHAT_CONTAINER]).css({ display: 'none' });
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({ display: 'flex', 'flex-direction': 'column' });
        if($("body").data("page") == "sector") {
            $('#panelRightTI').css({display: 'flex'});
        }
    }

    return !checkClick;
}

function sendToSocketMessage(idInput, socketChat, srcId, targetId) {
    if (idInput.val().trim() === "") {
        return;
    } else {
        const sendMsg = {
            action: "sendOrderMessage",
            srcId: srcId,
            targetId: targetId,
            message: idInput.val()
        }
        
        idInput.val("");
        
        socketChat.send(JSON.stringify(sendMsg));
    }
}

function insertDataToChatBox(idChat, message, currentUser) {
    if ($.trim(message) === "") {
        return;
    }

    if(currentUser) {
        idChat.append(
            `<div class='message-recipient'>
                <div class='message-recipient-show'>
                    ${formatTextOutput(message)}
                </div>
            </div>`
        );
    } else {
        idChat.append(
            `<div class='message-recipient-external'>
                <div class='message-recipient-show-external'>
                    ${formatTextOutput(message)}
                </div>
            </div>`
        );
    }
}