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
            
            insertScript(sectorScripts, NONCE).then(
                $(".loading-page").css({display: "none"})
            ).finally($(".root").css({display: "flex"}));  
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

            insertScript(tiScripts, NONCE).then(
                $(".loading-page").css({display: "none"})
            ).finally($(".root").css({display: "flex"}));  
            break;
        }
    });