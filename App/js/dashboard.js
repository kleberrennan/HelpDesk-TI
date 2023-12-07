const TICHAT = 1;
const SECTORCHAT = 2;
const DEFAULT_VALUE = 0;
const SUCCESS_CALL_SECTOR ="successCall";
const CALL_NOT_ATTENDED = "stillCall";
const multiplierHeightChat = 20;
const DEFAULT_VALUE_SIZE_TEXTAREA = 30;
const CURRENT_HOST = window.location.host;
const ID_TI = 2;

const ACTION_URL = "../../Server/Handler/Actions.php";
var currentIdOrder = 0;
var isAnimateErr = false;

function getDashboardName() {
    const currentDashboard = window.location.pathname;
    const posName = 4;

    const pageName = currentDashboard.split("/")[posName].replace(/\.php$/, "");
    return pageName;
}

function showMsg(idContainer, message, typeMsg) {
    var imgContainer = '';

    if(isAnimateErr == false) {
        isAnimateErr = true;
        if(typeMsg != undefined && typeMsg != null) {
            switch(typeMsg) {
                case SUCCESS_CALL_SECTOR:
                    imgContainer = '<img src="../../assets/dashboard/sector/shyDev.png" alt="Success Call Sector" class="img-call">';

                    $(idContainer).css({
                        'padding': '0.2em',
                        'background-color': '#0D7FA3',
                        'color': '#fff',
                    })

                    $(`${idContainer} .description-err`).css({
                        'display': 'flex',
                        'flex-direction': 'row',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'background-color': '#0D7FA3',
                        'color': '#fff'
                    });

                    $(`${idContainer} .title-err`).css({
                        'display': 'none',
                    })
                    if($(`${idContainer} .img-call`).length == 0) {
                        $(`${idContainer} .description-err`).prepend(imgContainer);
                    }

                    $(`${idContainer} .img-call`).css({
                        'width': '5em',
                        'height': '5em',
                    })
                    break;
                    case CALL_NOT_ATTENDED:
                        imgContainer = '<img src="../../assets/dashboard/sector/waitCall.png" alt="Success Call Sector" class="img-call">';

                        $(idContainer).css({
                            'padding': '0.2em',
                            'background-color': '#003A8F',
                            'color': '#fff',
                        })

                        $(`${idContainer} .description-err`).css({
                            'display': 'flex',
                            'flex-direction': 'row',
                            'justify-content': 'center',
                            'align-items': 'center',
                            'background-color': '#003A8F',
                            'color': '#fff'
                        });

                        $(`${idContainer} .title-err`).css({
                            'display': 'none',
                        })
                        if($(`${idContainer} .img-call`).length == 0) {
                            $(`${idContainer} .description-err`).prepend(imgContainer);
                        }

                        $(`${idContainer} .img-call`).css({
                            'width': '5em',
                            'height': '5em',
                        })
                        break;
            }
        }

        $(`${idContainer} .description-err p`).text(message);
        $(idContainer).css({display: 'flex', opacity: '100', 'margin-right': '0'}).animate({
            opacity: '90',
            'margin-right': '1em'
        }, 1000, function() {
            $(idContainer).css({display: 'none'});
            isAnimateErr = false;
        });
    }
}
var shiftPressed = true;

function handleKeydown(textarea, key, defaultValueTextArea, multiplierHeightChat, receiverBox, isTI = false, socketChat) {
    const ENTER_KEY = "Enter"; 
    
    var counterSpace = 1;
    var newSize = defaultValueTextArea;
    var isOnlyEnter = false;
    var checkText = textarea.selectionStart;

    if(key === "Shift") {
        counterSpace += 1;
        shiftPressed = true;
    }

    if(shiftPressed && key === ENTER_KEY) {
        if (textarea.val() === "" || checkText > 0) {
            isOnlyEnter = true;
        } else {
            isOnlyEnter = false;
            newSize = newSize + multiplierHeightChat;

            if (newSize == 50) {
                textarea.css({
                    'overflow-y': 'scroll',
                });
            }

            textarea.css({
                'height': newSize + 'px',
            });
            shiftPressed = false;
        }
    } else if (!shiftPressed && key === ENTER_KEY) {
        isOnlyEnter = true;
        counterSpace = 1;
        sendMsgChat(receiverBox, textarea, socketChat, ID_TI, currentIdOrder);
        textarea.val('');

        textarea.css({
            'height': isTI ? '100%' : defaultValueTextArea + "px",
            'overflow-y': 'hidden',
        });
    }

    return {
        shiftPressed: shiftPressed,
        counterSpace: counterSpace,
        newSize: newSize,
        isOnlyEnter: isOnlyEnter
    }
}

function generateVerseBible() {
    const bibleVerses = [
        ` "Não fui eu que ordenei a você? Seja forte e corajoso! 
           Não se apavore nem desanime, pois o Senhor, o seu Deus, 
           estará com você por onde você andar" - Josué 1:9`,
        ` "E Adão conheceu Eva, que ela ficou grávida de Samael, 
           o anjo desejável, e ela concebeu e deu à luz a Caim e 
           ela disse: "Tenho adquirido um homem do anjo desejável" - Gênesis 4:1`,
        ` "Quem derramar sangue do homem,
           pelo homem seu sangue será derramado;
           porque à imagem de Deus
           foi o homem criado." - Gênesis 9:6`,
        ` "Encontro esta lei que atua em mim: Quando faço o bem,
           o mal me acompanha. Intimamente o meu ser
           tem prazer na Lei de Deus; mas vejo outra lei atuando nos 
           membros do meu corpo, guerreando contra a lei da minha mente, 
           tornando-me prisioneiro da lei do pecado que atua em mim".
           Romanos 7:21-23`
    ];

    let randNumber = Math.floor(Math.random() * bibleVerses.length);
    randNumber = randNumber % bibleVerses.length;

    $("#versesBible p").text(bibleVerses[randNumber]);
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

function startChatFeature(targetChat, checkClick) {
    const NO_CHAT_CONTAINER = 0;
    const CHAT_CONTAINER = 1;
    let toggleContainerIDs = [];

    switch (targetChat) {
        case TICHAT:
            toggleContainerIDs = ['#supportCallTI', '#chatWithTI'];
            break;
        case SECTORCHAT:
            $("#menuSwitchCallType").css({ display: checkClick ? 'none' : 'flex' });
            toggleContainerIDs = ['#receiveCallsTI', '#chatWithSector'];
            break;
    }

    if (checkClick) {
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({ display: 'none' });
        $(toggleContainerIDs[CHAT_CONTAINER]).css({ display: 'flex' });

    } else {
        $(toggleContainerIDs[CHAT_CONTAINER]).css({ display: 'none' });
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({ display: 'flex', 'flex-direction': 'column' });
    }

    return !checkClick;
}

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

function formatTextOutput(inputText, isChat = false) {
    let formatText = inputText.replace(/\n/g, isChat ? "" : "<br>");
    return formatText;
}

function insertDataToChatBox(idChat, isCurrentUser = true, message) {
    if(isCurrentUser) {
        idChat.append(
            `<div class='message-recipient'>
                <div class='message-recipient-show'>
                    ${formatTextOutput(message)}
                </div>
            </div>`
        );
    } else {
        idChat.append(
            `<div class='message-recipient'>
                <div class='message-recipient-show'>
                    TRIGGERTRIGGER!${formatTextOutput(message)}
                </div>
            </div>`
        );
    }
}

function sendMsgChat(idChat, idInput, socketChat, srcId, targetId, isCurrentUser = true) {
    if (idInput.val().trim() === "") {
        return;
    } else {
        const sendMsg = {
            action: "sendOrderMessage",
            srcId: srcId,
            targetId: targetId,
            message: idInput.val()
        }

        socketChat.send(JSON.stringify(sendMsg));

        insertDataToChatBox(idChat, true, sendMsg['message']);
    }
}

function generateOrdersBoxes(idContainer) {
    return $.ajax({
        method: "POST",
        url: ACTION_URL,
        data: {
            action: "listAllOrders"
        },
        success: function(response) {
            var data = JSON.parse(JSON.parse(response));
            var orders = data.response.message;
            var ordersArr = [];
            var dataHTML = "";

            Object.keys(orders).forEach((index) => {
                const order = orders[index];
                const newTimestamp = new Date(order.calltimestamp);
                ordersArr.push(order.idcall);

                dataHTML += `
                                <div data-order="${order.idcall}" class="call-ti-sector center-container-flex-row">
                                    <div class="metadata-call">
                                        <p><span>SETOR: </span>${order.userName}</p>
                                        <p><span>RAZÃO: </span>${order.reasoncall}</p>
                                        <p><span>HORA: </span>${newTimestamp.getHours()}:${newTimestamp.getMinutes()}</p>
                                    </div>
                                    <div class="options-call center-container-flex-row">
                                        <div class='center-container-flex-row'>
                                            <img src="../../assets/dashboard/support/chatTIOpt.png" alt="chat" id=orderChat_${order.idcall} data-idOrder=${order.idcall}>
                                            <img src="../../assets/dashboard/support/bookTIOpt.png" alt="readMore" id="openReadMoreCall_call_1">
                                        </div>
                                        <div class='center-container-flex-row'>
                                            <img src="../../assets/dashboard/support/workerTIOpt.png" alt="ownerCall" id="assignOwnerCall_call_1">
                                            <img src="../../assets/dashboard/support/finishTIOpt.png" alt="finishCall" id="finishCall_call_1">
                                        </div>
                                    </div>
                                </div>
                            `
                ;
            });
            
            $(idContainer).html(dataHTML);

            return ordersArr;
        }, error: function(error) {
            console.error("Error: " + error);
        }
    })
}

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

$(document).ready(() => {
    const userType = getDashboardName();

    const firstOptSector = "opt-home";
    const optSectorArr = [firstOptSector, "opt-citizen-call", "opt-support-call", "opt-about"];

    const ENTER_KEYBOARD_CODE = 13;
    const dashboardOptions = 1;
    const callTypeOptions = 2;

    switch (userType) {
        case 'sector':
            var currentOpt = firstOptSector;

            var shiftPressed = false;
            var counterSpace = 1;
            var newSize = DEFAULT_VALUE_SIZE_TEXTAREA;
            var isOnlyEnter = false;
            var checkClick = false;

            currentOpt = initOptions(optSectorArr, currentOpt, dashboardOptions);

            $("#openChatWithSupport").click(function () {
                checkClick = startChatFeature(TICHAT, checkClick);
            });

            $("#inputMessageTI").on("keydown", function (e) {
                const textarea = $("#inputMessageTI");
                const receiverBox = $("#chatTIMessages");
                const key = e.originalEvent.key;

                const result = handleKeydown(textarea, key, DEFAULT_VALUE_SIZE_TEXTAREA, multiplierHeightChat, receiverBox);

                shiftPressed = result.shiftPressed;
                counterSpace = result.counterSpace;
                isOnlyEnter = result.isOnlyEnter;
            });

            $("#inputMessageTI").on("input", function () {
                const textarea = $("#inputMessageTI");

                if (isOnlyEnter) {
                    textarea.val("");
                    isOnlyEnter = false;
                }
                textarea.text(textarea.val());
            });

            $("#sendInputMessageTI").click(function () {
                const inputVal = $("#inputMessageTI").val();
                if (inputVal === "") {
                    return;
                } else {
                    sendMsgChat($("#chatTIMessages"), $("#inputMessageTI"), ID_TI, currentIdOrder);
                    $("#inputMessageTI").val('').val().replace(/(\r\n|\n|\r)/gm, '').trim();
                }
            });

            function checkOrderExistence() {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        method: 'POST',
                        url: ACTION_URL,
                        data: {
                            action: 'checkOrderSector',
                        },
                        success: function(response) {
                            try {
                                let result = JSON.parse(response);
                                let toJSON = JSON.parse(result);
                                resolve(toJSON.response.message);
                            } catch(err) {
                                reject(err);
                            }
                        },
                        error: function(err) {
                            console.error(err);
                            reject(err);
                        }
                    })
                })
                
            }

            $("#buttonCallTI").click(function() {
                const select = $("#reasonCall");
                const optionValue = select.val();
                const idPopUp = "#popupErrSupportTI"; 
                const DEFAULT_OPTION = $("#reasonCall option:first");
                
                if(optionValue == DEFAULT_OPTION) {
                    showMsg(idPopUp, "Selecione uma razão!");
                } else {
                    checkOrderExistence().then(function(isOrder) {
                        if(isOrder == false) {
                            const requestUser = {
                                'name': "insertOrderSector",
                                'param': {
                                    'reasonCall': optionValue
                                }
                            }
    
                            $.ajax({
                                method: 'POST',
                                url: ACTION_URL,
                                data: {
                                    action: requestUser['name'],
                                    data: requestUser['param']
                                },
                                success: function(response) {
                                    console.log(response);
                                }, error: function(err) {
                                    console.error(err);
                                }
                            })
                        } else {
                            showMsg(idPopUp, "Calminha amigão! O seu chamado ainda está em atendimento!", CALL_NOT_ATTENDED);
                        }
                    }).catch(function(error) {
                        console.error(error);
                    })
                }
            });

            $("#opt-logout-sector").click(function() {
                $.ajax({
                    method: 'POST',
                    url: ACTION_URL,
                    data: {
                        action: "logout"
                    },
                    success: function(response) {
                        //console.log(response);
                        window.location.reload();
                    }, error: function(err) {
                        console.error(err);
                    }
                })
            })

            break;

        case 'ti':
            const firstOptTI = "opt-home-ti";
            const firstOptCallType = "callTypeTI";

            const optTIArr = [firstOptTI, "opt-ti-receiver", "opt-report-generate"];
            const optCallTypeArr = [firstOptCallType, "callTypeCitizen"];

            let currentOptDashboard = firstOptTI;
            let currentOptTypeCall = firstOptCallType;

            currentOptDashboard = initOptions(optTIArr, currentOptDashboard, dashboardOptions);
            currentOptTypeCall = initOptions(optCallTypeArr, currentOptTypeCall, callTypeOptions);

            let chatWithSectorClick = true;

            var chatOrder = "";

            generateOrdersBoxes("#receiveCallsTI").done(function(orders) {
                var orderJSON = JSON.parse(JSON.parse(orders)).response.message;

                Object.values(orderJSON).forEach((order) => {
                    $(`#orderChat_${order.idcall}`).click(function() {
                        chatOrder = initChatSocketTI(order.idcall);
                        currentIdOrder = order.idcall;
                        chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
                    })
                })
            });

            var shiftPressed = false;
            var counterSpace = 1;
            var newSize = DEFAULT_VALUE_SIZE_TEXTAREA;
            var isOnlyEnter = false;
            var checkClick = false;

            currentOpt = initOptions(optSectorArr, currentOpt, dashboardOptions);

            $("#openChatWithSupport").click(function () {
                checkClick = startChatFeature(TICHAT, checkClick);
            });

            $("#messageChatInput").on("keydown", function (e) {
                const textarea = $("#messageChatInput");
                const receiverBox = $("#chatSECTORMessages");
                const key = e.originalEvent.key;

                const result = handleKeydown(textarea, key, DEFAULT_VALUE_SIZE_TEXTAREA, multiplierHeightChat, receiverBox, true, chatOrder);

                shiftPressed = result.shiftPressed;
                counterSpace = result.counterSpace;
                isOnlyEnter = result.isOnlyEnter;
            });

            $("#messageChatInput").on("input", function () {
                const textarea = $("#messageChatInput");

                if (isOnlyEnter) {
                    textarea.val("");
                    isOnlyEnter = false;
                }
                textarea.text(textarea.val());
            });

            $("#messageChatInput").click(function () {
                const inputVal = $("#messageChatInput").val();
                if (inputVal === "") {
                    return;
                } else {
                    sendMsgChat($("#chatTIMessages"), $("#messageChatInput"), chatOrder, ID_TI, currentIdOrder);
                    $("#messageChatInput").val('').val().replace(/(\r\n|\n|\r)/gm, '').trim();
                }
            });

            if (chatWithSectorClick) {
                $("#closeChatSector").click(function () {
                    chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
                    openConnections.pop(currentIdOrder);
                    $("#chatSECTORMessages").html("");
                });

                $("#sendInputMessageSECTOR").click(function () {
                    const inputVal = $("#messageChatInput").val();

                    sendMsgChat($("#chatSECTORMessages"), $("#messageChatInput"), chatOrder, ID_TI, currentIdOrder);
                });
            }


            $("#opt-logout-ti").click(function() {
                $.ajax({
                    method: 'POST',
                    url: ACTION_URL,
                    data: {
                        action: "logout"
                    },
                    success: function(response) {
                        window.location.reload();
                    }, error: function(err) {
                        console.error(err);
                    }
                })
            })

            break;
    }
});