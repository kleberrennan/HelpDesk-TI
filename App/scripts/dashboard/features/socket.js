var isActionSent = false;

function initChatSocket(idToRegister, receiverBox = null, isTI = false, dataRequest = null, randId = false) {    
    var chatOrder = new WebSocket("ws://127.0.0.1:8080");

    chatOrder.onopen = function(e) {
        var registerUser = {}

        if(dataRequest.action == 'registerUser' && dataRequest.type == 'order') {
            console.dir(dataRequest)
            chatOrder.send(JSON.stringify(dataRequest));
        } else {
            registerUser = {
                action: "registerUser",
                srcId: idToRegister
            }

            chatOrder.send(JSON.stringify(registerUser));
        }
        console.log(dataRequest.action)
        /*if(action != null) {
            console.dir(action)
            chatOrder.send(JSON.stringify(action));
            chatOrder.close();
            return;
        } */
        
        if(randId) {
            return;
        }
    }

    chatOrder.onmessage = function(e) {
        const dataJSON = JSON.parse(e.data);
        console.dir(e);
        if(isTI) {
            if(receiverBox != null && receiverBox.data("currentChatOrder") == dataJSON.srcId) {
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
                        insertDataToChatBox(receiverBox, dataJSON.message, isCurrent);
                        break;
                }
            };
        }
    }
    
    return chatOrder;
}