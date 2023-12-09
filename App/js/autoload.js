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

    switch(currentPage) {
        case INDEX_PAGE:
            const indexScripts = ["./js/auth/auth"];

            insertScript(indexScripts, NONCE);
            break;
        case SECTOR_DASHBOARD:
            const sectorScripts = [
                "../../js/dashboard/features/options",
                "../../js/dashboard/features/keydown", 
                "../../js/dashboard/features/socket",
                "../../js/dashboard/features/notification",
                "../../js/dashboard/features/bible",
                "../../js/dashboard/features/chat",
                "../../js/dashboard/sector"
            ];
            
            insertScript(sectorScripts, NONCE);  
            break;
        case TI_DASHBOARD:
            const tiScripts = [
                "../../js/dashboard/features/keydown", 
                "../../js/dashboard/features/socket",
                "../../js/dashboard/features/orders",
                "../../js/dashboard/features/options",
                "../../js/dashboard/features/chat",
                "../../js/dashboard/ti"
            ];

            insertScript(tiScripts, NONCE); 
            break;
        }
    }
    );