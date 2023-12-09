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

function isRequestedCall(btnId, idSector, isSector = false) {
    POST("../../Server/Handler/Actions.php", {
        action: "getRequestStatusTI",
        data: {
            targetSector: idSector
        }
    }).then(function(response) {
        const dataJSON = JSON.parse(JSON.parse(response));
          
        if(isSector) {
            if(dataJSON.response.message == true) {
                $(btnId).css({cursor: 'pointer', opacity: '1'});
                $(btnId).click(function () {
                    checkClick = startChatFeature(TICHAT, !checkClick);
                });

                webSocket = initChatSocket(userId, receiverBox, false);
            } else {
                $(btnId).css({cursor: 'not-allowed', opacity: '0.3'});
                webSocket = null;
            }
        }

        return webSocket;
    })
    
}