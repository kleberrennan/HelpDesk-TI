function showMsg(idContainer, message, typeMsg) {
    const conf = config.pages.sector.stateCall;
    const isTypeMsg = typeMsg != undefined && typeMsg != null;
    var isOwnerCall = false;
    var imgContainer = '';

    if(isAnimateErr == false) {
        isAnimateErr = true;
        if(isTypeMsg) {
            switch(typeMsg) {
                case conf.SUCCESS_CALL_SECTOR:
                    imgContainer = '<img src="../../assets/dashboard/sector/shyDev.png" alt="Success Call Sector" class="img-call">';

                    $(idContainer).css({
                        'padding': '0.2em',
                        'background-color': '#0D7FA3',
                        'color': '#fff',
                    })

                    idContainer.find(".description-err").css({
                        'display': 'flex',
                        'flex-direction': 'row',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'background-color': '#0D7FA3',
                        'color': '#fff'
                    });

                    idContainer.find(".title-err").css({
                        'display': 'none',
                    })
                    if($(idContainer).find(".img-call").length == 0) {
                        $(idContainer).find(".description-err").prepend(imgContainer);
                    }

                    $(idContainer).find(".img-call").css({
                        'width': '5em',
                        'height': '5em',
                    })
                    break;
                    case conf.CALL_NOT_ATTENDED:
                        imgContainer = '<img src="../../assets/dashboard/sector/waitCall.png" alt="Success Call Sector" class="img-call">';

                        $(idContainer).css({
                            'padding': '0.2em',
                            'background-color': '#003A8F',
                            'color': '#fff',
                        })

                        $(idContainer).find(".description-err").css({
                            'display': 'flex',
                            'flex-direction': 'row',
                            'justify-content': 'center',
                            'align-items': 'center',
                            'background-color': '#003A8F',
                            'color': '#fff'
                        });

                        $(idContainer).find(".title-err").css({
                            'display': 'none',
                        })
                        if($(idContainer).find(".img-call").length == 0) {
                            $(idContainer).find(".description-err").prepend(imgContainer);
                        }

                        $(idContainer).find(".img-call").css({
                            'width': '5em',
                            'height': '5em',
                        })
                            break;
                        case conf.OWNER_CALL_RECEIVED:
                            isOwnerCall = true;
                            $(idContainer).css({
                                display: "flex"
                            })
                            break;
            }
        }
        console.log(isOwnerCall);
        !isOwnerCall ? 
            $(idContainer).find(".description-err p").text(message)
            :
            $(idContainer).find(".description-ti p").text(message)

        $(idContainer).css({display: 'flex', opacity: '100', 'margin-right': '0'}).animate({
            opacity: '90',
            'margin-right': '1em'
        }, 1000, function() {
            $(idContainer).css(isOwnerCall ? {'display': 'flex'} : {'display': 'none'});
            isAnimateErr = false;
        });
    }
}