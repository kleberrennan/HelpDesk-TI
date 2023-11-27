const TICHAT = 1;
const SECTORCHAT = 2;

function getUserData() {
    $.ajax({
        method: 'POST',
        url: "../../server/index.php",
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.error(error);
        }
    })
}

function getDashboardName() {
    const currentDashboard = window.location.pathname;

    const pageName = currentDashboard.split("/")[4].replace(/\.php$/, "");

    return pageName;
}

function switchOption(idContainer, currentOpt, activeClass) {
    const activeOpt = 0;
    const activeContent = 1;

    $(`#${currentOpt}`).removeClass(activeClass[activeOpt]);
    $(`#${idContainer}`).addClass(activeClass[activeOpt]);
    $(`#${currentOpt}-content`).removeClass(activeClass[activeContent]);
    $(`#${idContainer}-content`).addClass(activeClass[activeContent]);
    return idContainer;
}

function startChatFeature(targetChat, checkClick) {
    const NO_CHAT_CONTAINER = 0;
    const CHAT_CONTAINER = 1;
    var toggleContainerIDs = [];

    switch(targetChat) {
        case TICHAT:
            toggleContainerIDs = ['#supportCallTI', '#chatWithTI'];
            break;
        case SECTORCHAT:
            if(checkClick) {
                $("#menuSwitchCallType").css({display: 'none'});
            } else {
                $("#menuSwitchCallType").css({display: 'flex'});
            }

            toggleContainerIDs = ['#receiveCallsTI', '#chatWithSector'];
            break;
    }
    if(checkClick) {
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({display: 'none'});
        $(toggleContainerIDs[CHAT_CONTAINER]).css({display: 'flex'});
        return false;
    } else {
        $(toggleContainerIDs[CHAT_CONTAINER]).css({display: 'none'});
        $(toggleContainerIDs[NO_CHAT_CONTAINER]).css({display: 'flex', 'flex-direction': 'column'});
        return true;             
    }
}

function initOptions(optsArr, currentOpt, typeOpt) {
    optsArr.forEach((idOpt) => {
        $(`#${idOpt}`).click(function(event) {
            switch(typeOpt) {
                case 1:
                    const activeClassDashboard = ["opt-active", "active-data-opt"];

                    if(event.target.id === "") {
                        currentOpt = switchOption(event.currentTarget.id, currentOpt, activeClassDashboard);
                    } else {
                        currentOpt = switchOption(event.target.id, currentOpt, activeClassDashboard);
                    }
                break;
                case 2:
                    const activeClassCallType = ["call-type-active", "active-type-call"];

                    if(event.target.id === "") {
                        currentOpt = switchOption(event.currentTarget.id, currentOpt, activeClassCallType);
                    } else {
                        currentOpt = switchOption(event.target.id, currentOpt, activeClassCallType);
                    }
                break;
            }
        })
    });
}

function sendMsgChat(idChat, idInput) {
    if(idInput.val().trim() === "") {
        console.log("EMPTY");
    } else {
        idChat.append(
            `<div class='message-recipient'>
                <div class='message-recipient-show'>
                    ${idInput.val()}
                </div>
            </div>`
        );
    }
}

//getUserData();

$(document).ready(() => {
    const userType = getDashboardName();

    const ENTER_KEYBOARD_CODE = 13;

    const dashboardOptions = 1;
    const callTypeOptions = 2;

    switch(userType) {
        case 'sector':
            function execAnimation() {
                $("#panelAnimate .main-data").css({marginLeft: '0px'}).animate({
                    'marginLeft': '1em',
                }, 2000, function() {
                    $("#panelAnimate").css({marginLeft: '0px'});
                })
            }
            //execAnimation();
            console.log("tear");
            const firstOptSector = "opt-home";
            const optSectorArr = [firstOptSector, "opt-citizen-call", "opt-support-call", "opt-about"];

            var currentOpt = firstOptSector;
            var chatWithTIClick = true;

            currentOpt = initOptions(optSectorArr, currentOpt, dashboardOptions);

            $("#openChatWithSupport").click(function() {
                chatWithTIClick = startChatFeature(TICHAT, chatWithTIClick);
            });

            if(chatWithTIClick) {
                $("#sendInputMessageTI").click(function() {
                    if($("#inputMessageTI").val() === "") 
                    { return; } else {
                        //sendMsgChat("#chatTIMessages")
                        $("#chatTIMessages").append(
                            `<div class='message-recipient'>
                                <div class='message-recipient-show'>
                                    ${$("#inputMessageTI").val()}
                                </div>
                            </div>`
                        );

                        $("inputMessageTI").attr("value", "");
                    }
                })
            }

            break;
        case 'ti':
            const firstOptTI = "opt-home-ti";
            const firstOptCallType = "callTypeTI";

            const optTIArr = [firstOptTI, "opt-ti-receiver", "opt-report-generate"];
            const optCallTypeArr = [firstOptCallType, "callTypeCitizen"];

            var currentOptDashboard = firstOptTI;
            var currentOptTypeCall = firstOptCallType;

            var chatWithSectorClick = true;

            currentOptDashboard = initOptions(optTIArr, currentOptDashboard, dashboardOptions);
            currentOptTypeCall = initOptions(optCallTypeArr, currentOptTypeCall, callTypeOptions);
            
            const closeChat = $("#closeChatSector");
            const sendMsg = $("#sendInputMessageSECTOR");
            const userMsg = $("#messageChatInput");
            const receiverMsg = $("#chatSECTORMessages")

            $("#openChatWithSector_call_1").click(function() {
                chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
                console.log(chatWithSectorClick);
            });

            if(chatWithSectorClick) {
                closeChat.click(function() {
                    chatWithSectorClick = startChatFeature(SECTORCHAT, chatWithSectorClick);
                })
                
                sendMsg.click(function() {
                    console.log(userMsg.val());
                    sendMsgChat(receiverMsg, userMsg)
                })
            }
        break;
    }
})