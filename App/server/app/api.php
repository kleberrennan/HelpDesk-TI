<?php

require __DIR__ . "/../../../vendor/autoload.php";

require_once __DIR__ . "/../agent/user.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class API extends REST {
    private $ISSUER = 'localhost';

    public function __construct() {
        parent::__construct();
    }

    public function generateToken() {
        try {
            $sectorName = $this->validateParam("userName", $this->param['userName'], STRING);
            $passwSector = $this->validateParam('passwUser', $this->param['userPassw'], STRING);

            $stmt = $this->dbConn->prepare("SELECT * FROM users WHERE 
            userPassw = :passwUser AND userName = :nameUser");

            $stmt->bindParam(":nameUser", $sectorName);
            $stmt->bindParam(":passwUser", $passwSector);

            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!is_array($user)) {
                $this->returnResponse(INVALID_USER_PASS, "Invalid user or pass!");
            }

            if(isset($user['useractive']) && $user['useractive'] == 0) {
                $this->returnResponse(USER_NOT_ACTIVE, "User isn't active! Please contact to admin.");
            }

            $payload = [
                'iat' => time(),
                'iss' => $this->ISSUER,
                'exp' => time() + (15*60),
                'userId' => $user['userid']
            ];

            $token = JWT::encode($payload, SECRET_KEY, 'HS256');

            setcookie('tokenUser', $token, [
                'expires' => $payload['exp'], 
                'path' => '/', 
                'domain' => '', 
                'secure' => false, 
                'httponly' => true,
                'samesite' => 'Strict',
            ]);

            $data = ['token' => $token];

            $this->returnResponse(SUCCESSFULL_RESPONSE, $data);

        } catch(Exception $e) {
            $this->throwError(JWT_PROCESSING_ERROR, $e->getMessage());
        }
    }

    public function getUserDetails() {
        $this->validateParam('userToken', $this->param['userToken'], STRING);
        $userToken = JWT::decode($this->param['userToken'], new Key(SECRET_KEY, 'HS256'));
        $user = new \User;
        $user->setIdUser($userToken->userId);
        $result = $user->getUserDetails();
        
        if(!is_array($result)) {
            $this->returnResponse(USER_DETAILS_DONT_FOUND,
        "User Details Data can't be found!");
        }

        $response['userName'] = $result['username'];
        $response['userType'] = $result['usertype'];

        $this->returnResponse(SUCCESSFULL_RESPONSE, $response);
    }
}
?>