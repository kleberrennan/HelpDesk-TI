<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
session_start();

if(isset($_COOKIE["tokenUser"])) {
    $token = $_COOKIE["tokenUser"];
    $url = "http://127.0.0.1/App/server/index.php";
    $curl = curl_init();
    $requestData = array(
        "name" => "getUserDetails",
        "param" => [
            "userToken" => $token
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

        if($responseDecode !== null) {
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self' script-src 'self' https://code.jquery.com"
    />
    <title>Dashboard: Setor</title>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" 
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
            crossorigin="anonymous"></script>

    <link rel="stylesheet" href="../../css/dashboard.css"/>
    <link rel="stylesheet" href="../../css/mobile.css"/>
    <link rel="stylesheet" href="../../css/animate.css"/>
</head>
<body>
    <div class="root">
        <div class="panel-left" id="panelAnimate">
            <div class="main-data center-container-flex-column">
                <p class="title-main-data"><span>Centro</span> Iterma</p>
                <p class="version-program">v1.0</p>
                <p class="title-dashboard-data">Olá <?php echo $_SESSION['userName'] ?>!
            </div>
            <div class="options-container">
                <div id="opt-home" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between opt-active">
                    <img src="../../assets/dashboard/sector/iconHome.png" alt="Inicio" class="opt-image-dashboard">
                    <p>Inicio</p>
                </div>
                <div id="opt-citizen-call" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between">
                    <img src="../../assets/dashboard/sector/callIcon.png" alt="Chamados" class="opt-image-dashboard">
                    <p>Cidadão</p>
                </div>
                <div id="opt-support-call" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between">
                    <img src="../../assets/dashboard/sector/tiIcon.png" alt="Suporte" class="opt-image-dashboard">
                    <p>Suporte</p>
                </div>
                <div id="opt-about" class="center-container-flex-row opt-dashboard-left small-div-height opt-space-between">
                    <img src="../../assets/dashboard/sector/aboutIcon.png" alt="Sobre" class="opt-image-dashboard">
                    <p>Sobre</p>
                </div>
            </div>
        </div>
        <div class="content-panel center-container-flex-column active-data-opt" id="opt-home-content">
            <div class="icon-sectors">
                <img src="../../assets/dashboard/sector/sectorUser.png" alt="Sectors">
            </div>
            <div class="data-home-content">
                <p>Seja <span>bem-vindo</span> ao sistema</p>
                <p class="title-home-content">Centro Iterma</p>
            </div>
        </div>
        <div class="content-panel center-container-flex-column" id="opt-citizen-call-content">
            <div class="icon-sectors">
                <img src="../../assets/dashboard/sector/attendantIcon.png" alt="Sectors">
            </div>
            <div class="data-citizen-content">
                <p>Nenhum <span>chamado</span> no momento</p>
            </div>
        </div>
        <div class="support-call-container content-panel center-container-flex-column" id="opt-support-call-content">
            <div id="chatWithTI" class="container-wrapper">
                <div class="title-chat-ti center-container-flex-column">CHAT COM TI</div>
                <div class="messages-container" id="chatTIMessages">
                    
                </div>
                <div class="input-message-chat-ti center-container-flex-row">
                    <textarea name="input-message-ti" id="inputMessageTI"></textarea>
                    <img src="../../assets/dashboard/sector/sendMessage.png" alt="sendInput" id="sendInputMessageTI">
                </div>
            </div>
            <div class="container-wrapper center-container-flex-column" id="supportCallTI">
                <div class="img-support-ti">
                    <img src="../../assets/dashboard/sector/tiSupport.png" alt="ICON">
                </div>
                <div class="upper-data-ti">
                    <h1>Suporte de TI</h1>
                    <div class="info-data-ti">
                        <p>Faça o seu chamado apenas clicando abaixo</p>
                    </div>
                </div>
                <div class="separator-support-content"></div>
                <div class="reason-call center-container-flex-column">
                    <h3>Motivo da Chamada</h3>
                    <select name="reasonCall" class="none-border" id="">
                        <option value="choose" disabled>Escolha a razão</option>
                        <option value="noInternet">Sem Internet</option>
                    </select>
                </div>
                <div class="button-call-ti center-container-flex-row">
                    <img src="../../assets/dashboard/sector/callBtnIcon.png" alt="">
                    <p>CHAMAR</p>
                </div>
                <div class="feedbackBtn">
                    <div class="emotionsOpts">
                        <div class="badEmote">
                            <img src="../../assets/dashboard/sector/FeedbackIcon/emote_1_bad.png" alt="Bad">
                            <p>Ruim</p>
                        </div>
                        <div class="averageEmote">
                            <img src="../../assets/dashboard/sector/FeedbackIcon/emote_2_average.png" alt="Average">
                            <p>+/-</p>
                        </div>
                        <div class="goodEmote">
                            <img src="../../assets/dashboard/sector/FeedbackIcon/emote_3_good.png" alt="Good">
                            <p>Bom</p>
                        </div>
                    </div>
                    <p>O <span>chamado</span> apenas será liberado após avaliação!</p>
                </div>
            </div>  
            <div class="panel-right-support-call">
                <img src="../../assets/dashboard/sector/callIcon.png" alt="" id="openChatWithSupport">
            </div>
        </div>
        <div class="content-panel center-container-flex-column citizen-opt-content-data" id="opt-about-content">
            <div class="main-data">
                <h1>Setor de Informática</h1>
                <p>De onde saiu este programa? Do setor de informática!</p>
            </div>
            <div class="photo-authors">
                <img src="../../assets/dashboard/sector/authors/kleber.jpg" alt="icon1">
                <img src="../../assets/dashboard/sector/authors/italo.jpg" alt="icon2">
                <img src="../../assets/dashboard/sector/authors/diorlan.jpg" alt="icon3">
            </div>
        </div>
    </div>
    <script src="../../js/dashboard.js"></script>
</body>
</html>