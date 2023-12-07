<?php
$nonceNumber = base64_encode(random_bytes(16));
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self' script-src 'self' 'nonce-<?php echo $nonceNumber?>' https://code.jquery.com"
    />

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" 
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
            crossorigin="anonymous"></script>

    <title>CI: LOGAR</title>

    <link rel="stylesheet" href="./css/auth.css">
    <script id="autoload" src="./js/autoload.js" nonce="<?php echo $nonceNumber?>"></script>
</head>
<body data-page-type="auth" data-page="index">
    <div class="root center-container-flex-column">
        <div class="message-error-container center-container-flex-column" id="messageErr">
            <div class="title-err center-container-flex-column">
                <p>ERRO</p>
            </div>
            <div class="description-err center-container-flex-column">
                <p id="err-content">test</p>
            </div>
        </div>
        <div class="container-auth center-container-flex-column">
            <div class="title-auth center-container-flex-row">
                <img src="./assets/auth/authIcon.png" alt="Icon">
                <p>Logar no <span>Sistema</span></p>
            </div>
            <div class="input-form-auth center-container-flex-column">
                <label for="userName">Usuário: </label>
                <input type="text" placeholder="DAF" name="userName" class="none-border" id="inputUserName"/>
                <label for="userPassw">Senha: </label>
                <input type="password" placeholder="*********" name="userPassw" class="none-border" id="inputUserPassw"/>
            </div>
            <div class="button-container center-container-flex-column">
                <button id="loginBtn">Logar</button>
            </div>
        </div>
    </div>
</body>
</html>