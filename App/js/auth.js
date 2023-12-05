const ACTION_URL = "http://127.0.0.1/App/Server/Handler/Actions.php";

var isAnimate = false;

function showError(idErrorContainer, idErrMsg, messageErr) {
    if(isAnimate == false) {
        isAnimate = true;

        $(idErrMsg).text(messageErr);
        $(idErrorContainer).css({display: 'flex', opacity: '100', 'margin-right': '0'}).animate({
            opacity: '90',
            'margin-right': '1em'
        }, 1000, function() {
            $(idErrorContainer).css({display: 'none'});
            isAnimate = false;
        });
    }
}

function isEmptyField(idContainer) {
    var contentId = $(idContainer).val();

    if(contentId === "") {
        return true; } else { return false; };
}


$(document).ready(function() {
    const authArrInputs = ["#inputUserName", "#inputUserPassw"];
    const ERROR_CODE = ["success", "empty_inputUserName", "empty_inputUserPassw"]

    const NOERROR = 0, EMPTYUSERNAME = 1, EMPTYUSERPASSW = 2;

    var errType = "";

    function validateInputs(inputArray) {
        inputArray.some((id, index) => {
            if(isEmptyField(id)) {
                errType = ERROR_CODE[index + 1];
                return true;
            } else {
                if(index == inputArray.length - 1) {
                    errType = ERROR_CODE[NOERROR];
                }
                return false;
            }
        });
    }

    $("#loginBtn").click(function(e) {
        e.preventDefault();
        validateInputs(authArrInputs);

        switch(errType) {
            case ERROR_CODE[EMPTYUSERNAME]:
                showError('#messageErr', '#err-content', 'Campo de Usuário VÁZIO!')
            break;
            case ERROR_CODE[EMPTYUSERPASSW]:
                showError('#messageErr', '#err-content', 'Senha vázia!')
            break;
            case ERROR_CODE[NOERROR]:
                const userName = $(authArrInputs[0]).val();
                const userPassw = $(authArrInputs[1]).val();
                const SUPPORT = "TI";
                const CITIZEN = "CIDADAO";

                const requestData = {
                    name: "generateToken",
                    param: {
                        userName: userName,
                        userPassw: userPassw
                    }
                }
                
                $.ajax({
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    url: "/../Server/index.php",
                    data: JSON.stringify(requestData),
                    success: function(response) {
                        var baseURL = "";

                        if(window.location.host == "localhost" || window.location.host == "127.0.0.1") {
                            baseURL = "/App/pages/dashboard";
                        } else {
                            baseURL = "/Test/HelpDesk-TI/App/pages/dashboard"
                        }

                        switch(userName) {
                            case SUPPORT:
                                window.location.replace(`${baseURL}/ti.php`);
                                break;
                            case CITIZEN:
                                window.location.replace(`${baseURL}/citizen.php`);
                                break;
                            default:
                                window.location.replace(`${baseURL}/sector.php`);
                        }
                    },
                    error: function(err) {
                        console.error("Error: " + err);
                    }
                })

            break;
        }
    })
})