const config = {
    server: {
        ACTION_URL: "../../Server/Handler/Actions.php",
    },
    pages: {
        sector: {
            action: {
                order: {
                    check: 'checkOrderSector',
                    insert: 'insertOrderSector',
                },
                logout: 'logout'
            },
            chat: {
                TICHAT: 1,
                SECTORCHAT: 2,
                CHAT_TI: "#openChatWithSupport",
                RECEIVER_BOX: "#chatTIMessages",
                INPUT_CHAT_TI: "#inputMessageTI",
                SEND_CHAT_TI: "#sendInputMessageSECTOR",
                CLOSE_CHAT_SECTOR: "#closeTIChat",
            },
            values: {
                DEFAULT_VALUE_SIZE_TEXTAREA: 30,
                dashboardOptions: 1,
                callTypeOptions: 2,
                multiplierHeightChat: 20,
                DEFAULT_VALUE: 0,
                ID_TI: 2,
            },
            stateCall: {
                SUCCESS_CALL_SECTOR: "successCall",
                CALL_NOT_ATTENDED: "stillCall",
                OWNER_CALL_RECEIVED: "ownerEstablished",
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