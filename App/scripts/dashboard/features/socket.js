var isActionSent = false;

function receiverOrderBox() {
    const requestSocket = {
        'action': 'registerUser',
        'type': 'order',
        'srcId': config.server.idChat.ID_TI,
    }

    return initChatSocket(null, $("#receiveCallsTI"), true, requestSocket, true);
}

function sendOrderToBox(idRequest) {
    const requestSocket = {
        'action': 'insertOrder',
        'orderId': idRequest,
        'targetBox': config.pages.constants.ID_TI
    }

    return initChatSocket(null, null, true, requestSocket, true);
}

function initChatSocket(idToRegister, receiverBox = null, isTI = false, dataRequest = null, randId = false) {    
    const currentServer = config.server.SOCKET_IP;
    
    var chatOrder = new WebSocket(`ws://${currentServer}:8080`);

    chatOrder.onopen = function(e) {
        if(dataRequest !== undefined && dataRequest !== null) {
            if(dataRequest.action == 'registerUser' && dataRequest.type) {
                return chatOrder.send(JSON.stringify(dataRequest));
            } else if(dataRequest.action == 'registerUser') {
                var registerUser = {
                    action: "registerUser",
                    srcId: idToRegister
                }

                return chatOrder.send(JSON.stringify(registerUser));
            } else {
                return chatOrder.send(JSON.stringify(dataRequest));
            }
        }
        
        if(randId) {
            return;
        }
    }

    chatOrder.onmessage = function(e) {
        const dataJSON = JSON.parse(e.data);
        console.dir(dataJSON);
        if(isTI) {
            switch(dataJSON["action"]) {
                case "insertOrder":
                    const orderHTML = getHTMLOrder(dataJSON);
                    const generateData = {
                        boxId: dataJSON.idcall,
                        ownerOptions: config.pages.ti.owner.options
                    }
                    receiverBox.append(orderHTML);
                    
                    generateListenersSocket(generateData, conf)
                    break;
                case "getOwnerOrder":
                    const ownerName = dataJSON['ownerName'];
                    const idBox = dataJSON['idBox'];
                    
                    $(`#ownerOrderTitle_${idBox}`).
                        html(`<span>POSSE:</span> ${ownerName}`);
                    break;
                case "broadcastDeleteOrder":
                    const boxId = dataJSON['idSector'];

                    $(`#boxOrder_${boxId}`).remove();
                    break;
                case 'sendOrderMessage':
                    const isCurrent = dataJSON['currentUser'] ? true : false;
                    console.log(isCurrent);
                    insertDataToChatBox(receiverBox, dataJSON.message, isCurrent);
                    break;

            }
            if(receiverBox != null && receiverBox.data("currentChatOrder") == dataJSON.srcId && dataJSON["action"] !== "sendOrderMessage") {
                insertDataToChatBox(receiverBox, dataJSON.message, false);
            }
        } else {
            if(dataJSON['action']) {
                const dataRequest = dataJSON['action'];
                
                switch(dataRequest) {
                    case 'getOwnerOrder':
                        if(dataJSON && 'ownerName' in dataJSON) {
                            var ownerName = dataJSON['ownerName'];
                            showMsg("#popUpOwnerTI", `${ownerName} atendeu o chamado!`, conf.stateCall.OWNER_CALL_RECEIVED);
                        } else { 
                            throw new Error("ownerName property doesn't exists!");
                        };
                        break;
                    case 'sendOrderMessage':
                        const isCurrent = dataJSON['currentUser'] ? true : false;
                        console.log(isCurrent);
                        insertDataToChatBox(receiverBox, dataJSON.message, isCurrent);
                        break;
                    case "broadcastDeleteOrder":
                        $(config.pages.sector.chat.CHAT_TI).off("click");
                        $(config.pages.sector.chat.CLOSE_CHAT_SECTOR).off("click");
                        $("#openChatWithSupport").css({
                            cursor: "not-allowed",
                            opacity: "0.3"
                        })
                        break;
                    case "callSector":
                            startChatFromSector();
                        break;
                }
            };
        }
    }
    
    return chatOrder;
}