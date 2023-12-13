var isActionSent = false;

function initChatSocket(idToRegister, receiverBox = null, isTI = false, action = null, randId = false) {    
    var chatOrder = new WebSocket("ws://127.0.0.1:8080");

    chatOrder.onopen = function(e) {
        const registerUser = {
            action: "registerUser",
            srcId: idToRegister
        }

        if(action != null) {
            chatOrder.send(JSON.stringify(action));
            chatOrder.close();
            return;
        } 
        
        if(randId) {
            return;
        }

        chatOrder.send(JSON.stringify(registerUser));
    }

    chatOrder.onmessage = function(e) {
        const dataJSON = JSON.parse(e.data);
        console.dir(dataJSON);
        if(isTI) {
            if(receiverBox != null && receiverBox.data("currentChatOrder") == dataJSON.srcId) {
                insertDataToChatBox(receiverBox, dataJSON.message, false);
            }
        } else {
            if(dataJSON['action']) {
                const action = dataJSON['action'];
                
                switch(action) {
                    case 'getOwnerOrder':
                        if(dataJSON && 'ownerName' in dataJSON) {
                            var ownerName = dataJSON['ownerName'];
                            showMsg("#popUpOwnerTI", `${ownerName} atendeu o chamado!`, OWNER_CALL_RECEIVED);
                        } else { 
                            throw new Error("ownerName property doesn't exists!");
                        };
                        break;
                    case 'sendOrderMessage':
                        insertDataToChatBox(receiverBox, dataJSON.message, false);
                        break;
                }
            };
        }
    }
    
    return chatOrder;
}