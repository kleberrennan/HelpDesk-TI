var openConnections = [];

function initChatSocketSector(orderId) {
    if(openConnections.includes(orderId)) {
        return;
    } else {
        openConnections.push(orderId);
        chatOrder = new WebSocket("ws://127.0.0.1:8080");

        chatOrder.onopen = function(e) {
            const registerUser = {
                action: "registerUser",
                srcId: orderId
            }

            chatOrder.send(JSON.stringify(registerUser));
        }

        chatOrder.onmessage = function(e) {
            console.log(e.data);
        }
    }

    return chatOrder;
}

function initChatSocketTI(orderId) {
    if(openConnections.includes(orderId)) {
        return;
    } else {
        openConnections.push(orderId);
        chatOrder = new WebSocket("ws://127.0.0.1:8080");

        chatOrder.onopen = function(e) {
            const registerUser = {
                action: "registerUser",
                srcId: ID_TI
            }

            chatOrder.send(JSON.stringify(registerUser));
        }

        chatOrder.onmessage = function(e) {
            insertDataToChatBox($("#chatSECTORMessages"), false, e.data);
        }
    }
    return chatOrder;
}