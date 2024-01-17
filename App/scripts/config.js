const config = {
    server: {
        ACTION_URL: "../../Server/Handler/Actions.php",
        SOCKET_IP: "127.0.0.1",
        idChat: {
            ID_TI: 2,
        }
    },
    pages: {
        constants: {
            DEFAULT_VALUE_SIZE_TEXTAREA: 30,
            dashboardOptions: 1,
            callTypeOptions: 2,
            multiplierHeightChat: 20,
            DEFAULT_VALUE: 0,
            ID_TI: 2,
        },
        
        ti: {
            chat: {
                TICHAT: 1,
                SECTORCHAT: 2,
                CLOSE_CHAT_TI: "#closeChatSector",
                SEND_CHAT_SECTOR: "#sendInputMessageSECTOR",
                RECEIVER_BOX: "#chatSECTORMessages",
                MESSAGE_INPUT: "#messageChatInput",
            },
            buttons: {
                LOGOUT: "#opt-logout-ti",
                CLOSE_BTN_OWNER: "#closeBtnOwner"
            },
            popups: {
                OWNER_POPUP: "#ownerPopUp",
                OVERLAY: "#popUpOverlay",
            }
        },
        sector: {
            action: {
                order: {
                    check: 'checkOrderSector',
                    insert: 'insertOrderSector',
                    isOwnerDefined: 'getOwnerById',
                    isRequestedChat: 'getRequestStatusTI'
                },
                logout: 'logout'
            },
            chat: {
                TICHAT: 1,
                SECTORCHAT: 2,
                CHAT_TI: "#openChatWithSupport",
                RECEIVER_BOX: "#chatTIMessages",
                INPUT_CHAT_TI: "#inputMessageTI",
                SEND_CHAT_TI: "#sendInputMessageTI",
                CLOSE_CHAT_SECTOR: "#closeTIChat",
            },
            stateCall: {
                SUCCESS_CALL_SECTOR: "successCall",
                CALL_NOT_ATTENDED: "stillCall",
                OWNER_CALL_RECEIVED: "ownerEstablished",
                FEEDBACK_REQUIRED: "feedbackRequired",
            },
            options: {
                firstOptSector: "opt-home",
                optSectorArr: ["opt-home", "opt-citizen-call", "opt-support-call", "opt-about"],
            },
            popups: {
                CHAT_ID_POPUP: "#popupErrSupportTI",
            },
            requestOrder: {
                SELECT_OPTIONS_CALL_TI: "#buttonCallTI",
            },
            buttons: {
                LOGOUT: "#opt-logout-sector",
            },
        }
    }
};

$("body").data("config", config);