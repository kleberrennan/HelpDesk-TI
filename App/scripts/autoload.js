/*
Script created to load automatically scripts with objective to keep maintenance
in the program
*/

const INDEX_PAGE = "index";
const SECTOR_DASHBOARD = "sector";
const TI_DASHBOARD = "ti";

function insertScript(scripts, nonce = null, isFirst = false) {
    return new Promise(function(resolve, reject) {
        if(typeof scripts !== 'object' && scripts instanceof Array) {
            reject("Scripts isn't an array!");
        }

        scripts.forEach((script) => {
            if(!isFirst) {
                $("body").append(`
                            <script src="${script}.js" nonce="${nonce}"></script>
                `);
            } else {
                $("body").prepend(`
                            <script src="${script}.js" nonce="${nonce}"></script>
                `);
            }

            resolve(script);
        })
    })
}

function POST(url, data) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            method: "POST",
            url: url,
            data: data,
            success: function(response) {
                resolve(response);
            }, error: function(error) {
                console.error(error);
                reject(error);
            }
        })
    })
}

$(document).ready(function() {
    const NONCE = $("#autoload").attr("nonce");
    const currentPage = $("body").data("page");

    let configPath = '../../scripts/config';

    switch(currentPage) {
        case INDEX_PAGE:
            const indexScripts = 
            [
                "./scripts/auth/auth"
            ];

            insertScript(indexScripts, NONCE);
            break;
        case SECTOR_DASHBOARD:
            const sectorScripts = [
                configPath,
                "../../scripts/dashboard/features/options",
                "../../scripts/dashboard/features/keydown", 
                "../../scripts/dashboard/features/socket",
                "../../scripts/dashboard/features/notification",
                "../../scripts/dashboard/features/bible",
                "../../scripts/dashboard/features/chat",
                "../../scripts/dashboard/sector"
            ];
            
            insertScript(sectorScripts, NONCE);  
            break;
        case TI_DASHBOARD:
            const tiScripts = [
                configPath,
                "../../scripts/dashboard/features/keydown", 
                "../../scripts/dashboard/features/socket",
                "../../scripts/dashboard/features/orders",
                "../../scripts/dashboard/features/options",
                "../../scripts/dashboard/features/chat",
                "../../scripts/dashboard/ti"
            ];

            insertScript(tiScripts, NONCE); 
            break;
        }
    });

/*
const CHAT_TI = "#openChatWithSupport";
const INPUT_CHAT_TI = "#inputMessageTI";
const SEND_CHAT_TI = "#sendInputMessageTI";
const SELECT_OPTIONS_CALL_TI = "#buttonCallTI";
const CHAT_ID_POPUP = "#popupErrSupportTI";
const ACTION_URL = "../../Server/Handler/Actions.php";
const DEFAULT_VALUE_SIZE_TEXTAREA = 30;
const SUCCESS_CALL_SECTOR ="successCall";
const CALL_NOT_ATTENDED = "stillCall";
const OWNER_CALL_RECEIVED = "ownerEstablished";

const firstOptSector = "opt-home";
const optSectorArr = [firstOptSector, "opt-citizen-call", "opt-support-call", "opt-about"];
const dashboardOptions = 1;
const callTypeOptions = 2;

const multiplierHeightChat = 20;

const TICHAT = 1;
const SECTORCHAT = 2;
const DEFAULT_VALUE = 0;

const ID_TI = 2;

const idToRegister = $(CHAT_TI).data('id-user');
const userId = $("#openChatWithSupport").data("id-user");
const receiverBox = $("#chatTIMessages");
*/