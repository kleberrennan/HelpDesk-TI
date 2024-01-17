function generateOrdersBoxes(idContainer, url) {
    return new Promise(function(resolve, reject) {
        POST(url, {action: "listAllOrders"}).then(function(response) {
            try {
                const DATA_SERVER = JSON.parse(JSON.parse(response));

                var orders = DATA_SERVER.response.message;
                var ordersArr = [];
                var insertHTML = "";

                Object.keys(orders).forEach((index) => {
                    const order = orders[index];
                    const newTimestamp = new Date(order.calltimestamp);
                    ordersArr.push(order.idcall);
                    if(order.ownercall == null) {
                        order.ownercall = "SEM POSSE";
                    }
                    console.dir(order)
                    insertHTML += `
                                    <div class="call-ti-sector center-container-flex-row" id=boxOrder_${order.authorcallid}>
                                        <div class="metadata-call">
                                            <p><span>SETOR: </span>${order.userName}</p>
                                            <p><span>RAZÃO: </span>${order.reasoncall}</p>
                                            <p><span>HORA: </span>${newTimestamp.getHours()}:${newTimestamp.getMinutes()}</p>
                                            <p id="ownerOrderTitle_${order.idcall}"><span>POSSE: </span>${order.ownercall}</p>
                                        </div>
                                        <div class="options-call center-container-flex-row">
                                            <div class='center-container-flex-row'>
                                                <img src="../../assets/dashboard/support/chatTIOpt.png" alt="chat" id=orderChat_${order.idcall} data-userOrder-id=${order.authorcallid} data-userName=${order.userName}>
                                                <img src="../../assets/dashboard/support/bookTIOpt.png" alt="readMore" id="openReadMoreCall_call_1">
                                            </div>
                                            <div class='center-container-flex-row'>
                                                <img src="../../assets/dashboard/support/workerTIOpt.png" alt="ownerCall" id="ownerBtn_${order.idcall}" data-userName=${order.userName}>
                                                <img src="../../assets/dashboard/support/finishTIOpt.png" alt="finishCall" id="finishCall_${order.idcall}">
                                            </div>
                                        </div>
                                    </div>
                                `
                    ;
                })

                $(idContainer).html(insertHTML);
                resolve(ordersArr);
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    })
}