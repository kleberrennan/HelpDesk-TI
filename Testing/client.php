<?php
    $curl = curl_init();

    $request = '{
        "name":"generateToken",
        "param":{
            "name_user": "DATGL",
            "passw_user": "DATGL123",
            "type_user": "SECTOR"
        }
    }';

    curl_setopt($curl, CURLOPT_URL, 'http://localhost:3000/Testing/server/');
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['content-type: application/json']);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $request);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($curl);
    $err = curl_error($curl);
    
    if($err) {
        echo 'Curl Error: ' . $err;
    } else {
        //header("Content-Type: application/json");
        $response = json_decode($result, true);
        if(isset($response['response']['message']['token'])) {
            var_dump($response['response']['message']['token']);
        } else {
            $errResponse = $response['response'];
            var_dump($errResponse);
        }
        curl_close($curl);
        curl_init($curl);
        $request = '{
            "name": "getTypeUser",
            "param": {
                "userId"
            }
        }';
    }

?>