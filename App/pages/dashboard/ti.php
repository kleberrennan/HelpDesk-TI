<?php
    
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self' script-src 'self' https://code.jquery.com"
    />
    <title>CI: SETOR</title>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" 
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
            crossorigin="anonymous"></script>

    <link rel="stylesheet" href="../../css/dashboard.css"/>
    <link rel="stylesheet" href="../../css/mobile.css"/>
</head>
<body>
    <div class="root">
        <div class="panel-left">
            <div class="main-data center-container-flex-column">
                <p class="title-main-data"><span>Centro</span> Iterma</p>
                <p class="version-program">v1.0</p>
                <p class="title-dashboard-data">Painel de <span>Suporte</span></p>
            </div>
            <div class="options-container">
                <div id="opt-home-ti" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between opt-active">
                    <img src="../../assets/dashboard/sector/iconHome.png" alt="Inicio" class="opt-image-dashboard">
                    <p>Inicio</p>
                </div>
                <div id="opt-ti-receiver" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between">
                    <img src="../../assets/dashboard/support/reportIcon.png" alt="Chamados" class="opt-image-dashboard">
                    <p>Chamados</p>
                </div>
                <div id="opt-report-generate" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between">
                    <img src="../../assets/dashboard/support/receivedCallWhite.png" alt="Suporte" class="opt-image-dashboard">
                    <p>Relatórios</p>
                </div>
            </div>
        </div>
        <div class="content-panel center-container-flex-column" id="opt-home-ti-content">
            <div class="main-content-home-ti center-container-flex-column">
                <img src="../../assets/dashboard/support/charMainTI.png" alt="TIUser">
                <p>Painel de <span>Suporte</span></p>
            </div>
        </div>
        <div class="content-panel center-container-flex-column active-data-opt" id="opt-ti-receiver-content">
            <div class="choose-type-call center-container-flex-row" id="menuSwitchCallType">
                <div class="ti-call-type call-type-active" id="callTypeTI">
                    <img src="../../assets/dashboard/sector/callIcon.png" alt="">
                    <p>Informática</p>
                </div>
                <div class="citizen-call-type" id="callTypeCitizen">
                    <img src="../../assets/dashboard/sector/attendantIcon.png" alt="">
                    <p>Cidadão</p>
                </div>
            </div>
            <div class="call-receiver-ti active-type-call" id="callTypeTI-content">
                <!-- READMORE BUTTON -->
                <div id="readMoreSector" class="container-wrapper"></div>
                <!-- POPUP OVERLAY -->
                <div id="popUpOverlay"></div>
                <!-- CHAT BUTTON -->
                    <div id="chatWithSector" class="container-wrapper">
                        <div class="title-chat-sector center-container-flex-row">
                            <div class="title-chat center-container-flex-column">
                                <p>CHAT COM [SETOR]</p>
                            </div>
                            <img src="../../assets/dashboard/support/closeIcon.png" alt="closeIcon" id="closeChatSector">
                        </div>
                        <div class="messages-container" id="chatSECTORMessages">
                        </div>
                        <div class="input-message-chat-ti center-container-flex-row">
                            <div class="input-user-container">
                                <input type="text" id="messageChatInput"/>
                            </div>
                            <img src="../../assets/dashboard/sector/sendMessage.png" alt="sendInput" id="sendInputMessageSECTOR">
                        </div>
                    </div>
                <!-- RECEIVE CALLS -->
                <div class="box-input-calls-ti" id="receiveCallsTI">
                    <div class="call-ti-sector center-container-flex-row">
                        <div class="metadata-call">
                            <p><span>SETOR: </span>[SETOR]</p>
                            <p><span>RAZÃO: </span>OUTROS MOTIVOS</p>
                            <p><span>HORA: </span>[DIA] [HORA]</p>
                        </div>
                        <div class="options-call center-container-flex-row">
                            <div class='center-container-flex-row'>
                                <img src="../../assets/dashboard/support/chatTIOpt.png" alt="chat" id="openChatWithSector_call_1">
                                <img src="../../assets/dashboard/support/bookTIOpt.png" alt="readMore" id="openReadMoreCall_call_1">
                            </div>
                            <div class='center-container-flex-row'>
                                <img src="../../assets/dashboard/support/workerTIOpt.png" alt="ownerCall" id="assignOwnerCall_call_1">
                                <img src="../../assets/dashboard/support/finishTIOpt.png" alt="finishCall" id="finishCall_call_1">
                            </div>
                        </div>
                    </div>
                    <div class="call-ti-sector center-container-flex-row">
                        <div class="metadata-call">
                            <p><span>SETOR: </span>[SETOR]</p>
                            <p><span>RAZÃO: </span>OUTROS MOTIVOS</p>
                            <p><span>HORA: </span>[DIA] [HORA]</p>
                        </div>
                        <div class="options-call center-container-flex-row">
                            <div class='center-container-flex-row'>
                                <img src="../../assets/dashboard/support/chatTIOpt.png" alt="chat" id="openChatWithSector_call_1">
                                <img src="../../assets/dashboard/support/bookTIOpt.png" alt="readMore" id="openReadMoreCall_call_1">
                            </div>
                            <div class='center-container-flex-row'>
                                <img src="../../assets/dashboard/support/workerTIOpt.png" alt="ownerCall" id="assignOwnerCall_call_1">
                                <img src="../../assets/dashboard/support/finishTIOpt.png" alt="finishCall" id="finishCall_call_1">
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="support-call-container content-panel center-container-flex-column" id="opt-report-generate-content">
           reports
        </div>
    </div>
    <script src="../../js/dashboard.js"></script>
</body>
</html>