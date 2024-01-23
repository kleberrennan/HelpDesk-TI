function getHTMLOrder(data) {
    const dataTimestamp = data.calltimestamp.split(/[- :.]/);

    const timestamp = new Date(
        dataTimestamp[0],
        dataTimestamp[1],
        dataTimestamp[2],
        dataTimestamp[3],
        dataTimestamp[4],
        dataTimestamp[5]);

    const hour = timestamp.getHours();
    const min = timestamp.getMinutes();
    
    const insertHTML = `
    <div class="call-ti-sector center-container-flex-row" id=boxOrder_${data.authorcallid}>
        <div class="metadata-call">
            <p>${data.userName}</p>
            <p>${data.reasoncall}</p>
            <p>${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}</p>
            <p id="ownerOrderTitle_${data.idcall}"><span>POSSE: </span>${data.ownercall}</p>
        </div>
        <div class="options-call center-container-flex-row">
            <div class='center-container-flex-row'>
                <img src="../../assets/dashboard/support/chatTIOpt.png" alt="chat" id=orderChat_${data.idcall} data-userOrder-id=${data.authorcallid} data-userName=${data.userName}>
                <img src="../../assets/dashboard/support/bookTIOpt.png" alt="readMore" id="openReadMoreCall_call_1">
            </div>
            <div class='center-container-flex-row'>
                <img src="../../assets/dashboard/support/workerTIOpt.png" alt="ownerCall" id="ownerBtn_${data.idcall}" data-userName=${data.userName}>
                <img src="../../assets/dashboard/support/finishTIOpt.png" alt="finishCall" id="finishCall_${data.idcall}">
            </div>
        </div>
    </div>
`
    return insertHTML;
}

function generateListenersSocket(data, conf) {
    const validOwner = data.ownerOptions.filter(owner => owner != undefined)

    const ownerOpts = validOwner.map((owner, index) => {
        return `<div>
                    <p id="ownerOpt_${index}">${owner}</p>
                </div>`
    });

    $(conf.popups.OWNER_POPUP)
        .find('.owner-options')
        .html(ownerOpts);

    $(conf.popups.OWNER_POPUP).find('.owner-options').on('click', 'p', function(e) {
            const ownerName = e.currentTarget.innerText;
            const orderId = data.boxId;
            const requestData = {
                'action': 'setOwnerOrder',
                'data': {
                    'ownerName': ownerName,
                    'ownerTitleId': orderId,
                }
            }

            POST(ACTION_URL, requestData).then(function(response) {
                getOwnerSocket(response, ownerName);
            })
        })

    $(`#ownerBtn_${data.boxId}`).click(function() {
        startOwnerBtn(data);
    });

    $(`#orderChat_${data.boxId}`).click(function() {
        startOrderChat(data)
    });

    $(`#finishCall_${data.boxId}`).click(function() {
        startFinishBtn(data)
    });
}
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

                    ordersArr.push(order.idcall);
                    if(order.ownercall == null) {
                        order.ownercall = "SEM POSSE";
                    }

                    insertHTML += getHTMLOrder(order);
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