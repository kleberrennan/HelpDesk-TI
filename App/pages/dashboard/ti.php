<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
session_start();

require_once(dirname(__DIR__) . "/../Server/Define/constants.php");

$_SESSION[COOKIE_TOKEN_USER] = $_COOKIE["tokenUser"];

$nonceNumber = base64_encode(random_bytes(16));

if(isset($_SESSION[COOKIE_TOKEN_USER]) && $_SESSION[COOKIE_TOKEN_USER] != null) {
    $token = $_SESSION[COOKIE_TOKEN_USER];
    $sectorType = "TI";
    $url = URL_SERVER;
    $curl = curl_init();
    $requestData = array(
        "name" => "getUserDetails",
        "param" => [
            "userToken" => $token,
            "typeUser" => $sectorType
        ]
    );

    $requestJSON = json_encode($requestData);

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $requestJSON);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_2);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        "Authorization: Bearer $token",
        "Content-Type: application/json" 
    ));

    $response = curl_exec($curl);
    $error = curl_error($curl);

    if(curl_errno($curl)) {
        echo "Error: " . $error;
    } else {
        $responseDecode = json_decode($response, true);

        if(isset($responseDecode['response']['status']) && $responseDecode['response']['status'] == USER_TYPE_IS_NOT_EQUAL) {
            header("Location: http://127.0.0.1/App/index.php");
        } else if($responseDecode !== null && isset($responseDecode['response']['message'])) {
            $userName = $responseDecode['response']['message']['userName'];
            $_SESSION["userName"] = $userName;
        }
    }

    curl_close($curl);
} else {
    session_destroy();
    header("Location: http://127.0.0.1/App/index.php");   
}    
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self'; connect-src 'self' ws://10.99.18.117:8080 ws://localhost:8080 ws://127.0.0.1:8080 wss://127.0.0.1:8080; script-src 'self' https://code.jquery.com 'nonce-<?php echo $nonceNumber?>';"
    />
    <title>CI: SETOR</title>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" 
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
            crossorigin="anonymous"></script>

    <link rel="stylesheet" href="../../css/dashboard.css"/>
    <link rel="stylesheet" href="../../css/mobile.css"/>
    <script id="autoload" src="../../scripts/autoload.js" nonce="<?php echo $nonceNumber?>"></script>
</head>
<body data-page-type="dashboard" data-page="ti">
    <div class="loading-page"><h1>Carregando...</h1></div>
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
                <div id="opt-feedback" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between">
                    <img src="../../assets/dashboard/support/feedbackBtn.png" alt="Suporte" class="opt-image-dashboard">
                    <p>Feedback</p>
                </div>
                <div id="opt-logout-ti" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between">
                    <img src="../../assets/dashboard/logoutIcon.png" alt="Sair" class="opt-image-dashboard">
                    <p>Sair</p>
                </div>
            </div>
        </div>
        <div class="content-panel center-container-flex-column active-data-opt" id="opt-home-ti-content">
            <div class="main-content-home-ti center-container-flex-column">
                <img src="../../assets/dashboard/support/charMainTI.png" alt="TIUser">
                <p>Painel de <span>Suporte</span></p>
            </div>
        </div>
        <div class="content-panel-ti-calls center-container-flex-column" id="opt-ti-receiver-content">
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
                <!-- OWNER PopUp -->
                <div id="ownerPopUp">
                    <div class="title-owner center-container-flex-row">
                        <div class="info-data-title">
                            > <span>SETOR</span>: INSERIR POSSE
                        </div>
                        <div id="closeBtnOwner">
                            <img src="../../assets/dashboard/support/closeIcon.png" alt="">
                        </div>
                    </div>
                    <div class="owner-options center-container-flex-column">
                    </div>
                </div>
                <!-- READMORE BUTTON -->
                <div id="readMoreSector" class="container-wrapper"></div>
                <!-- POPUP OVERLAY -->
                <div id="popUpOverlay"></div>
                <!-- CHAT BUTTON -->
                    <div id="chatWithSector" class="container-wrapper">
                        <div class="title-chat-sector center-container-flex-row">
                            <div class="title-chat center-container-flex-column">
                                <p id="titleChat">CHAT COM [SETOR]</p>
                            </div>
                            <img src="../../assets/dashboard/support/closeIcon.png" alt="closeIcon" id="closeChatSector">
                        </div>
                        <div class="messages-container" id="chatSECTORMessages">
                            <div id="loadingChat">
                                <p>Carregando...</p>
                            </div>
                        </div>
                        <div class="input-message-chat-ti center-container-flex-row">
                            <div class="input-user-container">
                                <textarea name="input-message-ti" id="messageChatInput" rows="1" cols="1" placeholder="Digite uma mensagem"></textarea>
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
            <div class="call-receiver-citizen" id="callTypeCitizen-content">test</div>
        </div>
        <div class="support-call-container content-panel center-container-flex-column" id="opt-report-generate-content">
           reports
        </div>
        <div class="content-panel-feedback" id="opt-feedback-content">
            <p>Feedback</p>
        </div>
    </div>
</body>
</html>