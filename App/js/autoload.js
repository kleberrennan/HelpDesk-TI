/*
Script created to load automatically scripts with objective to keep maintenance
in the program
*/

const INDEX_PAGE = "index";
const SECTOR_DASHBOARD = "sector";
const TI_DASHBOARD = "ti";

function insertScript(scriptPath, nonce = null, isFirst = false) {
    if(!isFirst) {
        $("body").append(`
                    <script src="${scriptPath}.js" nonce="${nonce}"></script>
        `);
    } else {
        $("body").prepend(`
                    <script src="${scriptPath}.js" nonce="${nonce}"></script>
        `);
    }
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

    switch(currentPage) {
        case INDEX_PAGE:
            insertScript("./js/auth/auth", NONCE);
            break;
        case SECTOR_DASHBOARD:
            insertScript("../../js/dashboard/features/socket", NONCE);
            insertScript("../../js/dashboard/features/notification", NONCE);
            insertScript("../../js/dashboard/features/options", NONCE);
            insertScript("../../js/dashboard/features/bible", NONCE);
            insertScript("../../js/dashboard/sector", NONCE);
            insertScript("../../js/dashboard/features/chat", NONCE);  
            break;
        case TI_DASHBOARD:
            insertScript("../../js/dashboard/features/keydown", NONCE); 
            insertScript("../../js/dashboard/features/chat", NONCE); 
            insertScript("../../js/dashboard/features/socket", NONCE);
            insertScript("../../js/dashboard/features/orders", NONCE);
            insertScript("../../js/dashboard/features/options", NONCE);
            insertScript("../../js/dashboard/ti", NONCE);
            break;
        }
    }
    );