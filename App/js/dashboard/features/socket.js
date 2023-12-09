function initChatSocket(idToRegister, receiverBox = null, isTI = false, action = null) {    
    var chatOrder = new WebSocket("ws://127.0.0.1:8080");

    chatOrder.onopen = function(e) {
        const registerUser = {
            action: "registerUser",
            srcId: idToRegister
        }

        if(action != null) {
            chatOrder.send(JSON.stringify(action));
        }

        chatOrder.send(JSON.stringify(registerUser));
    }

    chatOrder.onmessage = function(e) {
        const dataJSON = JSON.parse(e.data);
        if(isTI) {
            console.log(receiverBox.data("currentChatOrder"));
            console.dir(dataJSON);
            if(receiverBox.data("currentChatOrder") == dataJSON.srcId) {
                insertDataToChatBox(receiverBox, dataJSON.message, false);
            }
        } else {
            insertDataToChatBox(receiverBox, dataJSON.message, false);
        }
    }

    return chatOrder;
}