function handleKeydown(textarea, key, defaultValueTextArea, multiplierHeightChat, receiverBox, isTI = false, socketChat) {
    const ENTER_KEY = "Enter"; 
    
    var counterSpace = 1;
    var newSize = defaultValueTextArea;
    var isOnlyEnter = false;
    var checkText = textarea.selectionStart;

    if(key === "Shift") {
        counterSpace += 1;
        shiftPressed = true;
    }

    if(shiftPressed && key === ENTER_KEY) {
        if (textarea.val() === "" || checkText > 0) {
            isOnlyEnter = true;
        } else {
            isOnlyEnter = false;
            newSize = newSize + multiplierHeightChat;

            if (newSize == 50) {
                textarea.css({
                    'overflow-y': 'scroll',
                });
            }

            textarea.css({
                'height': newSize + 'px',
            });
            shiftPressed = false;
        }
    } else if (!shiftPressed && key === ENTER_KEY) {
        isOnlyEnter = true;
        counterSpace = 1;
        sendMsgChat(receiverBox, textarea, socketChat, ID_TI, currentIdOrder);
        textarea.val('');

        textarea.css({
            'height': isTI ? '100%' : defaultValueTextArea + "px",
            'overflow-y': 'hidden',
        });
    }

    return {
        shiftPressed: shiftPressed,
        counterSpace: counterSpace,
        newSize: newSize,
        isOnlyEnter: isOnlyEnter
    }
}