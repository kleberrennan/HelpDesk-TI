<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__DIR__) . "/Define/constants.php");

function execAPI($serviceName, $paramRequest) {
    $url = URL_SERVER;
    $curl = curl_init();
    $requestData = array(
        "name" => $serviceName,
        "param" => $paramRequest,
    );

    $userToken = $paramRequest['userToken'];
    $requestJSON = json_encode($requestData);

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $requestJSON);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_2);
    if(strtolower($serviceName) !== "generatetoken") {
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer $userToken",
            "Content-Type: application/json" 
        ));
    }

    $response = curl_exec($curl);
    $error = curl_error($curl);
    if(curl_errno($curl)) {
        echo "Error: " . $error;
    } else {
        $responseJSON = json_decode($response, true);
        $responseEncode = json_encode($response);
        if($serviceName == 'logout') {
            setcookie(COOKIE_TOKEN_USER, '', time() - 3600, '/', '', false, true);
        } else {
            echo $responseEncode;
        }
    }
    
    curl_close($curl);
}

if(isset($_POST["action"]) && !empty( $_POST["action"]))    {
    $action = $_POST["action"];
    $token = $_COOKIE[COOKIE_TOKEN_USER];

    switch($action) {
        case "generateToken":
            execAPI($action, [
                "userToken" => $token,
                "userName" => $_POST["userName"],
                "userPassw" => $_POST["userPassw"],
            ]);
            break;
        case "logout":
            execAPI($action, ["userToken" => $token]);
            break;
        case 'insertOrderSector':
            $reasonCall = $_POST['data']['reasonCall'];
            execAPI(
                $action, [
                    "userToken" => $token,
                    "reasonCall" => $reasonCall
            ]);
            break;
        case "listAllOrders":
            execAPI($action, ['userToken' => $token]);
            break;
        case 'getRequestStatusTI':
            $targetSector = $_POST['data']['targetSector'];
            execAPI($action, ['userToken' => $token, 'targetSector' => $targetSector]);
            break;
        case 'getChatMessages':
            $targetId = $_POST['data']['targetId'];
            execAPI($action, ['userToken' => $token, 'targetId' => $targetId]);
            break;
        case 'checkOrderSector':
            execAPI($action, ['userToken'=> $token]);
            break;
    }
}
?>