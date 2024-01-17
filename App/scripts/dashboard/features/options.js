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
          
        if(isSector) {
            if(dataJSON.response.message == true) {
                $(btnId).css({cursor: 'pointer', opacity: '1'});
                $(btnId).click(function () {
                    getChatMessages(config.pages.constants.ID_TI, $(conf.chat.RECEIVER_BOX));
                    checkClick = startChatFeature(config.pages.sector.chat.TICHAT, !checkClick);
                });

                const registerChat = {
                    action: "registerUser",
                    type: "chat",
                    srcId: userId,
                    targetId: config.pages.constants.ID_TI
                }
                console.dir(registerChat)
                webSocket = initChatSocket(userId, $("#chatTIMessages"), false, registerChat);
            } else {
                $(btnId).css({cursor: 'not-allowed', opacity: '0.3'});
                webSocket = null;
            }
        }

        return webSocket;
    })
    
}