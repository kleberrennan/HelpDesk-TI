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

                const userData = {
                    "name": "generateToken",
                    "param": {
                        "userName": userName,
                        "userPassw": userPassw,
                    },
                };

                $.ajax({
                    method: 'POST',
                    contentType: 'application/json',
                    url: '/App/server/index.php',
                    data: JSON.stringify(userData),
                    success: function(response) {
                        window.location.replace('/App/pages/dashboard/sector.php');
                    },
                    error: function(err) {
                        console.error("Error: " + err);
                    }
                })

            break;
        }
    })
})