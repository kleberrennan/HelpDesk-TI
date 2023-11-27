<?php
require __DIR__ . "/../../vendor/autoload.php";

use Firebase\JWT\JWT;

class API extends REST {
    private $ISSUER = 'localhost';

    public function __construct() {
        parent::__construct();
    }

    public function generateToken() {
        try {
            $sectorName = $this->validateParam("name_user", $this->param['userName'], STRING);
            $passwSector = $this->validateParam('passw_user', $this->param['userPassw'], STRING);

            $stmt = $this->dbConn->prepare("SELECT * FROM tbl_users WHERE 
            passw_user = :passwUser AND name_user = :nameUser");

            $stmt->bindParam(":nameUser", $sectorName);
            $stmt->bindParam(":passwUser", $passwSector);

            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!is_array($user)) {
                $this->returnResponse(INVALID_USER_PASS, "Invalid user or pass!");
            }

           /*if($user['active'] == 0) {
                $this->returnResponse(USER_NOT_ACTIVE, "User isn't active! Please contact to admin.");
            }*/

            $payload = [
                'iat' => time(),
                'iss' => $this->ISSUER,
                'exp' => time() + (15*60),
                'userId' => $user['id_user']
            ];

            $token = JWT::encode($payload, SECRET_KEY, 'HS256');

            $data = ['token' => $token];

            $this->returnResponse(SUCCESSFULL_RESPONSE, $data);

        } catch(Exception $e) {
            $this->throwError(JWT_PROCESSING_ERROR, $e->getMessage());
        }
    }

    public function getTypeUser() {
        try {

        } catch(\Exception $err) {

        }
    }
}
?>