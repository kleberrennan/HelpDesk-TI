function showMsg(idContainer, message, typeMsg) {
    var imgContainer = '';

    if(isAnimateErr == false) {
        isAnimateErr = true;
        if(typeMsg != undefined && typeMsg != null) {
            switch(typeMsg) {
                case SUCCESS_CALL_SECTOR:
                    imgContainer = '<img src="../../assets/dashboard/sector/shyDev.png" alt="Success Call Sector" class="img-call">';

                    $(idContainer).css({
                        'padding': '0.2em',
                        'background-color': '#0D7FA3',
                        'color': '#fff',
                    })

                    $(`${idContainer} .description-err`).css({
                        'display': 'flex',
                        'flex-direction': 'row',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'background-color': '#0D7FA3',
                        'color': '#fff'
                    });

                    $(`${idContainer} .title-err`).css({
                        'display': 'none',
                    })
                    if($(`${idContainer} .img-call`).length == 0) {
                        $(`${idContainer} .description-err`).prepend(imgContainer);
                    }

                    $(`${idContainer} .img-call`).css({
                        'width': '5em',
                        'height': '5em',
                    })
                    break;
                    case CALL_NOT_ATTENDED:
                        imgContainer = '<img src="../../assets/dashboard/sector/waitCall.png" alt="Success Call Sector" class="img-call">';

                        $(idContainer).css({
                            'padding': '0.2em',
                            'background-color': '#003A8F',
                            'color': '#fff',
                        })

                        $(`${idContainer} .description-err`).css({
                            'display': 'flex',
                            'flex-direction': 'row',
                            'justify-content': 'center',
                            'align-items': 'center',
                            'background-color': '#003A8F',
                            'color': '#fff'
                        });

                        $(`${idContainer} .title-err`).css({
                            'display': 'none',
                        })
                        if($(`${idContainer} .img-call`).length == 0) {
                            $(`${idContainer} .description-err`).prepend(imgContainer);
                        }

                        $(`${idContainer} .img-call`).css({
                            'width': '5em',
                            'height': '5em',
                        })
                        break;
            }
        }

        $(`${idContainer} .description-err p`).text(message);
        $(idContainer).css({display: 'flex', opacity: '100', 'margin-right': '0'}).animate({
            opacity: '90',
            'margin-right': '1em'
        }, 1000, function() {
            $(idContainer).css({display: 'none'});
            isAnimateErr = false;
        });
    }
}